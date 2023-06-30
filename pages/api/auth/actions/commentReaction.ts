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

export interface ICommentReactionBody {
    type: EReaction;
    post_id: number;
	post_type: EPostType;
    room_id: string;
    house_id: string;
    comment_id: string;
}

export interface ICommentReactionResponse {
    reaction: IReaction;
    isDeleted: boolean;
}

const handler: TNextApiHandler<ICommentReactionResponse, ICommentReactionBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_POST_REQUEST });
	}

	const { type, post_id, post_type, room_id, house_id, comment_id } = req.body;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_HOUSE_ID });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ROOM_ID });
	}

	if ((!post_id && post_id != 0) || typeof post_id !== 'number') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_POST_ID });
	}

	if (![EPostType.DISCUSSION, EPostType.PROPOSAL].includes(post_type)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_POST_TYPE });
	}

	if (!comment_id || typeof comment_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_COMMENT_ID });
	}

	let user_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({ error: messages.INVALID_TOKEN });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		user_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (!user_address) {
		return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error:  messages.INVALID_ADDRESS });
	}

	const commentsColRef = post_type === EPostType.PROPOSAL? proposalCommentCollection(house_id, room_id, post_id): discussionCommentCollection(house_id, room_id, post_id);

	const commentDocRef = commentsColRef.doc(String(comment_id));
	const commentDoc = await commentDocRef.get();

	if (!commentDoc || !commentDoc.exists || !commentDoc.data()) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: `Comment "${comment_id}" is not found for a Post "${post_id}" in a Room "${room_id}" and a House "${house_id}".` });
	}

	if (commentDoc.data()?.is_deleted) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: `Unable to add the reaction for a Comment "${comment_id}" because it is deleted.` });
	}

	const reactionsColRef = commentDocRef.collection('reactions');
	const reactionQuerySnapshot = await reactionsColRef.where('user_address', '==', user_address).get();
	if (reactionQuerySnapshot && !reactionQuerySnapshot.empty && reactionQuerySnapshot.size > 1) {
		return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: messages.MORE_THAN_ONE_USER_ADDRESS(user_address) });
	}

	let reactionDocRef = reactionsColRef.doc();
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
				reactionDocRef = doc.ref;
			}
		}
	}
	const reaction: IReaction = {
		id: reactionDocRef.id,
		type: type,
		user_address: user_address
	};
	reactionDocRef.set(reaction, { merge: true });
	res.status(StatusCodes.OK).json({
		isDeleted: false,
		reaction: reaction
	});
};

export default withErrorHandling(handler);