// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM } from '~src/global/min_token';
import { ICreatorDetails } from '~src/redux/rooms/@types';
import { joinedHouseCollection, joinedRoomCollection, roomCollection } from '~src/services/firebase/utils';
import { IJoinedRoomForUser, IRoom } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

interface ICustomRoom extends Omit<IRoom, 'created_at' | 'total_members' | 'creator_details' | 'min_token_to_create_proposal_in_room'> {
    creator_details: Omit<ICreatorDetails, 'address'>
}
export interface ICreateRoomBody {
    room: ICustomRoom;
}

export interface ICreateRoomResponse {
	createdRoom: IRoom;
	joinedRoom: IJoinedRoomForUser;
}

const handler: TNextApiHandler<ICreateRoomResponse, ICreateRoomBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}
	const { room } = req.body;

	if (!room) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('room details') });
	}

	if (!room.house_id || typeof room.house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('house') });
	}

	let address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('token') });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('address') });
	}

	const { house_id, id } = room;
	const roomRef = roomCollection(house_id).doc(id);
	const roomRefDoc = await roomRef.get();

	if (roomRefDoc && roomRefDoc.exists) {
		const data = roomRefDoc.data() as IRoom;
		if (data && data.house_id === house_id) {
			return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE1_NOT_FOUND_IN_TYPE2('Room',id,'House',house_id) });
		}
	}

	const createdRoom: IRoom = {
		...room,
		created_at: new Date(),
		creator_details: {
			...room.creator_details,
			address
		},
		min_token_to_create_proposal_in_room: MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM,
		total_members: 1
	};
	await roomRef.set(createdRoom, { merge: true });

	const joinedRoom: IJoinedRoomForUser = {
		house_id: house_id,
		id: id,
		is_joined: true,
		joined_at: new Date(),
		leaved_at: null
	};

	const joinedRoomRef = joinedRoomCollection(address, house_id).doc(id);
	const joinedHouseRef = joinedHouseCollection(address).doc(house_id);
	// adding joined house id
	joinedHouseRef.set({ house_id: house_id }, { merge: true }).then(() => {});

	await joinedRoomRef.set(joinedRoom, { merge: true });

	res.status(StatusCodes.OK).json({
		createdRoom,
		joinedRoom
	});
};

export default withErrorHandling(handler);