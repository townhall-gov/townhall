// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { discussionCommentCollection, proposalCommentCollection } from '~src/services/firebase/utils';
import { EPostType, EReaction } from '~src/types/enums';
import { IReaction } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export interface IReplyReactionBody {
    type: EReaction;
    post_id: number;
	post_type: EPostType;
    room_id: string;
    house_id: string;
    comment_id: string;
    reply_id: string;
}

export interface IReplyReactionResponse {
    reaction: IReaction;
    isDeleted: boolean;
}

const handler: TNextApiHandler<IReplyReactionResponse, IReplyReactionBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}

	const { type, post_id, post_type, room_id, house_id, comment_id, reply_id } = req.body;

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

	if (!reply_id || typeof reply_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('reply') });
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

	const commentsColRef = post_type === EPostType.PROPOSAL? proposalCommentCollection(house_id, room_id, post_id): discussionCommentCollection(house_id, room_id, post_id);
	const commentDocRef = commentsColRef.doc(String(comment_id));
	const commentDoc = await commentDocRef.get();

	if (!commentDoc || !commentDoc.exists || !commentDoc.data()) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Comment',comment_id,room_id,house_id) });
	}

	if (commentDoc.data()?.is_deleted) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.COMMENT_DELETED('add',reply_id) });
	}

	const commentReplyColRef = commentDocRef.collection('replies');
	const replyDocRef = commentReplyColRef.doc(String(reply_id));
	const replyDoc = await replyDocRef.get();

	if (!replyDoc || !replyDoc.exists || !replyDoc.data()) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.REPLY_NOT_FOUND(reply_id,comment_id,post_id,room_id,comment_id) });
	}

	if (replyDoc.data()?.is_deleted) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.COMMENT_DELETED('add',reply_id) });
	}

	const replyReactionColRef = replyDocRef.collection('reactions');
	const reactionQuerySnapshot = await replyReactionColRef.where('user_address', '==', user_address).get();

	if (reactionQuerySnapshot && !reactionQuerySnapshot.empty && reactionQuerySnapshot.size > 1) {
		return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: messages.MORE_THAN_ONE_REACTION(user_address) });
	}

	let replyReactionDocRef = replyReactionColRef.doc();
	if (reactionQuerySnapshot.docs.length > 0) {
		const doc = reactionQuerySnapshot.docs[0];
		if (doc && doc.exists) {
			const data = doc.data() as IReaction;
			if (data.type === type) {
				await doc.ref.delete();
				return res.status(StatusCodes.OK).json({
					isDeleted: true,
					reaction: data
				});
			} else {
				replyReactionDocRef = doc.ref;
			}
		}
	}
	const reaction: IReaction = {
		id: replyReactionDocRef.id,
		type: type,
		user_address: user_address
	};
	replyReactionDocRef.set(reaction, { merge: true });
	res.status(StatusCodes.OK).json({
		isDeleted: false,
		reaction: reaction
	});
};

export default withErrorHandling(handler);