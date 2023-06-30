// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { firebaseAdmin } from '~src/services/firebase';
import { discussionCollection, proposalCollection } from '~src/services/firebase/utils';
import { EAction, EPostType, ESentiment } from '~src/types/enums';
import { IReply, IHistoryReply } from '~src/types/schema';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export interface IReplyBody {
    reply: IReply;
    comment_id: string;
    post_id: number;
	post_type: EPostType;
    room_id: string;
    house_id: string;
    action_type: EAction;
}

export interface IReplyResponse {
    reply: IReply;
}

const handler: TNextApiHandler<IReplyResponse, IReplyBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}

	const { post_id, post_type, room_id, house_id, reply, comment_id, action_type } = req.body;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('house') });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('room') });
	}

	if ((!post_id && post_id != 0) || typeof post_id !== 'number') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('post') });
	}

	if (![EPostType.DISCUSSION, EPostType.PROPOSAL].includes(post_type)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('post type') });
	}

	if (!comment_id || typeof comment_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('comment') });
	}

	if (!action_type || ![EAction.ADD, EAction.DELETE, EAction.EDIT].includes(action_type)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error:  messages.INVALID_TYPE('api action type') });
	}

	if (!reply?.content) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_MUST_BE_GREATER_THAN('Reply') });
	}

	if ([EAction.EDIT, EAction.DELETE].includes(action_type) && !reply?.id) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('reply') });
	}

	if (reply.sentiment && ![ESentiment.COMPLETELY_AGAINST, ESentiment.COMPLETELY_FOR, ESentiment.NEUTRAL, ESentiment.SLIGHTLY_AGAINST, ESentiment.SLIGHTLY_FOR].includes(reply?.sentiment)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('reply sentiment') });
	}

	let user_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({ error: messages.INVALID_TYPE('token') });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		user_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (!user_address) {
		return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: messages.INVALID_TYPE('address') });
	}

	const postsColRef = post_type === EPostType.PROPOSAL? proposalCollection(house_id, room_id): discussionCollection(house_id, room_id);
	const postDocRef = postsColRef.doc(String(post_id));
	const postDoc = await postDocRef.get();

	if (!postDoc || !postDoc.exists) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Post',post_id,room_id,house_id) });
	}

	const commentDocRef = postDocRef.collection('comments').doc(comment_id);
	const commentDocSnapshot = await commentDocRef.get();
	if (!commentDocSnapshot || !commentDocSnapshot.exists || !commentDocSnapshot.data()) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE1_NOT_FOUND_IN_TYPE2('comment',comment_id,'post',post_id) });
	}

	const newReply: IReply = {
		...reply
	};

	const now = new Date();
	if (action_type === EAction.ADD) {
		const replyDocRef = commentDocRef.collection('replies').doc();
		newReply.id = replyDocRef.id;
		newReply.is_deleted = false;
		newReply.created_at = now;
		newReply.updated_at = now;
		newReply.deleted_at = null;
		newReply.post_id = post_id;
		newReply.comment_id = comment_id;
		newReply.user_address = user_address;
		newReply.history = [];
		const reply = {
			...newReply
		};
		delete (reply as any).reactions;
		await replyDocRef.set(reply, { merge: true });
	} else if (action_type === EAction.DELETE) {
		const replyDocRef = commentDocRef.collection('replies').doc(String(reply.id));
		const replyDoc = await replyDocRef.get();
		if (replyDoc && replyDoc.exists) {
			newReply.deleted_at = now;
			// Marked it as deleted, so that we can not show it in the UI, and we can use this reply for further reference.
			newReply.is_deleted = true;
			await replyDocRef.update({
				deleted_at: now,
				is_deleted: true
			});
		} else {
			return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE1_NOT_FOUND_IN_TYPE2('Reply',reply.id,'Post',post_id) });
		}
	} else if (action_type === EAction.EDIT) {
		const replyDocRef = commentDocRef.collection('replies').doc(String(reply.id));
		const replyDoc = await replyDocRef.get();
		if (replyDoc && replyDoc.exists) {
			const data = replyDoc.data() as IReply;
			// IF content is same return error
			if (data.content === reply.content) {
				return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.UNABLE_TO_EDIT_CONTENT_SAME('reply') });
			}
			// Edit history
			const historyReply: IHistoryReply = {
				content: data.content,
				created_at: data.updated_at,
				sentiment: data.sentiment
			};
			// Populate history array
			newReply.history = (data.history && Array.isArray(data.history)) ? [...data.history, historyReply] : [historyReply];
			newReply.history = newReply.history.map((historyItem) => {
				return {
					content: historyItem.content,
					created_at: convertFirestoreTimestampToDate(historyItem.created_at),
					sentiment: historyItem.sentiment || ESentiment.NEUTRAL
				};
			});
			// Update comment date
			newReply.updated_at = now;
			await replyDocRef.update({
				content: reply.content,
				// Array union is used to add new history comment to the array
				history: firebaseAdmin.firestore.FieldValue.arrayUnion(historyReply),
				sentiment: reply.sentiment,
				updated_at: now
			});
		} else {
			return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE1_NOT_FOUND_IN_TYPE2('Reply',reply.id,'Post',post_id) });
		}
	} else {
		return res.status(StatusCodes.BAD_REQUEST).json({ error:  messages.INVALID_TYPE('api action type') });
	}

	res.status(StatusCodes.OK).json({
		reply: newReply
	});
};

export default withErrorHandling(handler);