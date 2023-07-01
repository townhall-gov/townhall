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
import { IComment, IHistoryComment } from '~src/types/schema';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export interface ICommentBody {
    comment: IComment;
    post_id: number;
	post_type: EPostType;
    room_id: string;
    house_id: string;
    action_type: EAction;
}

export interface ICommentResponse {
    comment: IComment;
}

const handler: TNextApiHandler<ICommentResponse, ICommentBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}

	const { post_id, post_type, room_id, house_id, comment, action_type } = req.body;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('house') });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('room') });
	}

	if ((!post_id && post_id != 0) || typeof post_id !== 'number') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('post') });
	}

	if (!action_type || ![EAction.ADD, EAction.DELETE, EAction.EDIT].includes(action_type)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('api action type') });
	}

	if (!post_type || ![EPostType.DISCUSSION, EPostType.PROPOSAL].includes(post_type)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('post type') });
	}

	if (!comment?.content) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_MUST_BE_GREATER_THAN('Comment') });
	}

	if ([EAction.EDIT, EAction.DELETE].includes(action_type) && !comment?.id) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('comment') });
	}

	if (comment.sentiment && ![ESentiment.COMPLETELY_AGAINST, ESentiment.COMPLETELY_FOR, ESentiment.NEUTRAL, ESentiment.SLIGHTLY_AGAINST, ESentiment.SLIGHTLY_FOR].includes(comment?.sentiment)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('Comment sentiment') });
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

	const postsColRef = post_type === EPostType.PROPOSAL?proposalCollection(house_id, room_id): discussionCollection(house_id, room_id);
	const postDocRef = postsColRef.doc(String(post_id));
	const postDoc = await postDocRef.get();

	if (!postDoc || !postDoc.exists) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Post',post_id,room_id,house_id) });
	}

	const commentsColRef = postDocRef.collection('comments');
	const newComment: IComment = {
		...comment
	};

	const now = new Date();
	if (action_type === EAction.ADD) {
		const commentDocRef = commentsColRef.doc();
		newComment.id = commentDocRef.id;
		newComment.is_deleted = false;
		newComment.created_at = now;
		newComment.updated_at = now;
		newComment.deleted_at = null;
		newComment.post_id = post_id;
		newComment.user_address = user_address;
		newComment.history = [];
		const comment = {
			...newComment
		};
		delete (comment as any).reactions;
		delete (comment as any).replies;
		await commentDocRef.set(comment, { merge: true });
	} else if (action_type === EAction.DELETE) {
		const commentDocRef = commentsColRef.doc(String(comment.id));
		const commentDoc = await commentDocRef.get();
		if (commentDoc && commentDoc.exists) {
			newComment.deleted_at = now;
			// Marked it as deleted, so that we can not show it in the UI, and we can use this comment for further reference.
			newComment.is_deleted = true;
			await commentDocRef.update({
				deleted_at: now,
				is_deleted: true
			});
		} else {
			return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE1_NOT_FOUND_IN_TYPE2('Comment',comment.id,'Post',post_id) });
		}
	} else if (action_type === EAction.EDIT) {
		const commentDocRef = commentsColRef.doc(String(comment.id));
		const commentDoc = await commentDocRef.get();
		if (commentDoc && commentDoc.exists) {
			const data = commentDoc.data() as IComment;
			// IF content is same return error
			if (data.content === comment.content) {
				return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.UNABLE_TO_EDIT_CONTENT_SAME('Comment') });
			}
			// Edit history
			const historyComment: IHistoryComment = {
				content: data.content,
				created_at: data.updated_at,
				sentiment: data.sentiment
			};
			// Populate history array
			newComment.history = (data.history && Array.isArray(data.history)) ? [...data.history, historyComment] : [historyComment];
			newComment.history = newComment.history.map((historyItem) => {
				return {
					content: historyItem.content,
					created_at: convertFirestoreTimestampToDate(historyItem.created_at),
					sentiment: historyItem.sentiment || ESentiment.NEUTRAL
				};
			});
			// Update comment date
			newComment.updated_at = now;
			await commentDocRef.update({
				content: comment.content,
				// Array union is used to add new history comment to the array
				history: firebaseAdmin.firestore.FieldValue.arrayUnion(historyComment),
				sentiment: comment.sentiment,
				updated_at: now
			});
		} else {
			return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE1_NOT_FOUND_IN_TYPE2('Comment',comment.id,'Post',post_id) });
		}
	} else {
		return res.status(StatusCodes.BAD_REQUEST).json({ error:  messages.INVALID_TYPE('api action type') });
	}

	commentsColRef.where('is_deleted', '==', false).count().get().then((doc) => {
		const data = doc.data();
		if (data) {
			postDocRef.set({ comments_count: data.count }, { merge: true });
		}
	});

	res.status(StatusCodes.OK).json({
		comment: newComment
	});
};

export default withErrorHandling(handler);