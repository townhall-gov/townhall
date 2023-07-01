// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { discussionCollection, proposalCollection } from '~src/services/firebase/utils';
import { EPostType, EReaction } from '~src/types/enums';
import { IReaction } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export interface IReactionBody {
    type: EReaction;
    post_id: number;
	post_type: EPostType;
    room_id: string;
    house_id: string;
}

export interface IReactionResponse {
    reaction: IReaction;
    isDeleted: boolean;
}

const handler: TNextApiHandler<IReactionResponse, IReactionBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}

	const { type, post_id, room_id, house_id, post_type } = req.body;

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

	const reactionsColRef = postDocRef.collection('reactions');
	const reactionQuerySnapshot = await reactionsColRef.where('user_address', '==', user_address).get();
	if (reactionQuerySnapshot && !reactionQuerySnapshot.empty && reactionQuerySnapshot.size > 1) {
		return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: messages.MORE_THAN_ONE_REACTION(user_address) });
	}

	let reactionDocRef = reactionsColRef.doc();
	if (reactionQuerySnapshot.docs.length > 0) {
		const doc = reactionQuerySnapshot.docs[0];
		if (doc && doc.exists) {
			const data = doc.data() as IReaction;
			if (data.type === type) {
				await doc.ref.delete();
				reactionsColRef.get().then((querySnapshot) => {
					const reactions_count = {
						[EReaction.DISLIKE]: 0,
						[EReaction.LIKE]: 0
					};
					querySnapshot.docs.forEach((doc) => {
						const data = doc.data() as IReaction;
						reactions_count[data.type]++;
					});
					postDocRef.set({ reactions_count: reactions_count }, { merge: true });
				});
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
	await reactionDocRef.set(reaction, { merge: true });
	reactionsColRef.get().then((querySnapshot) => {
		const reactions_count = {
			[EReaction.DISLIKE]: 0,
			[EReaction.LIKE]: 0
		};
		querySnapshot.docs.forEach((doc) => {
			const data = doc.data() as IReaction;
			reactions_count[data.type]++;
		});
		postDocRef.set({ reactions_count: reactions_count }, { merge: true });
	});
	res.status(StatusCodes.OK).json({
		isDeleted: false,
		reaction: reaction
	});
};

export default withErrorHandling(handler);