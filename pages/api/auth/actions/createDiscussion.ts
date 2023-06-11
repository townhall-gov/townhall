// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { create } from '~src/onchain-data/utils/apis';
import { houseCollection, discussionCollection, roomCollection } from '~src/services/firebase/utils';
import { IDiscussion, IRoom } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export type TDiscussionPayload = Omit<IDiscussion, 'proposer_address' | 'created_at' | 'updated_at' | 'id' | 'reactions' | 'comments'>;

export interface ICreateDiscussionBody {
    discussion: TDiscussionPayload;
    proposer_address: string;
}

export interface ICreateDiscussionResponse {
	createdDiscussion: IDiscussion;
}

const handler: TNextApiHandler<ICreateDiscussionResponse, ICreateDiscussionBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { discussion, proposer_address } = req.body;
	create();
	if (!discussion || typeof discussion !== 'object') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Unable to create a discussion, insufficient information for creating a discussion.' });
	}

	if (!proposer_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid address.' });
	}

	const { house_id, room_id } = discussion;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid houseId.' });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid roomId.' });
	}

	let logged_in_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid token' });
		}

		const user = await authServiceInstance.GetUser(token);
		if(!user) {
			return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		}
		logged_in_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (proposer_address !== logged_in_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'LoggedIn address is not matching with Proposer address' });
	}

	const houseDocSnapshot = await houseCollection.doc(house_id).get();
	if (!houseDocSnapshot.exists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `House "${house_id}" does not exist.` });
	}

	const roomDocSnapshot = await roomCollection(house_id).doc(room_id).get();
	const roomData = roomDocSnapshot.data() as IRoom;
	if (!roomDocSnapshot.exists || !roomData) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Room "${room_id}" does not exist in a House "${house_id}".` });
	}

	let newID = 0;
	const discussionsColRef = discussionCollection(house_id, room_id);
	const lastDiscussionQuerySnapshot = await discussionsColRef.orderBy('id', 'desc').limit(1).get();
	if (!lastDiscussionQuerySnapshot.empty && lastDiscussionQuerySnapshot.docs.length > 0) {
		const lastDiscussionDoc = lastDiscussionQuerySnapshot.docs[0];
		if (lastDiscussionDoc) {
			const lastDiscussionData = lastDiscussionDoc.data() as IDiscussion;
			newID = Number(lastDiscussionData.id) + 1;
		}
	}

	const discussionDocRef = discussionsColRef.doc(String(newID));
	const discussionDocSnapshot = await discussionDocRef.get();
	if (discussionDocSnapshot && discussionDocSnapshot.exists && discussionDocSnapshot.data()) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Discussion "${newID}" already exists in a Room "${room_id}" and a House "${house_id}".` });
	}

	const now = new Date();
	const newDiscussion: Omit<IDiscussion, 'comments' | 'reactions'> = {
		...discussion,
		created_at: now,
		id: newID,
		proposer_address: proposer_address,
		updated_at: now
	};

	await discussionDocRef.set(newDiscussion, { merge: true });

	res.status(StatusCodes.OK).json({
		createdDiscussion: {
			...newDiscussion,
			comments: [],
			reactions: []
		}
	});
};

export default withErrorHandling(handler);