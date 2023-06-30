// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { joinedRoomCollection, roomCollection } from '~src/services/firebase/utils';
import { IRoom, IJoinedRoom, IJoinedRoomForUser } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export interface ILeaveRoomBody {
    houseId: string;
    roomId: string;
}

export interface ILeaveRoomResponse {
	updatedRoom: IRoom;
}

const handler: TNextApiHandler<ILeaveRoomResponse, ILeaveRoomBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}
	const { houseId, roomId } = req.body;

	if (!houseId || typeof houseId !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('house') });
	}

	if (!roomId || typeof roomId !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('room') });
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

	const roomRef = roomCollection(houseId).doc(roomId);
	const roomRefDoc = await roomRef.get();

	if (!roomRefDoc || !roomRefDoc.exists || !roomRefDoc.data()) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE1_NOT_FOUND_IN_TYPE2('Room',roomId,'house',houseId) });
	}

	const leavedRoom: IJoinedRoomForUser = {
		house_id: houseId,
		id: roomId,
		is_joined: false,
		joined_at: new Date(),
		leaved_at: new Date()
	};

	const joinedRoomRef = joinedRoomCollection(address, houseId).doc(roomId);
	const joinedRoomDoc = await joinedRoomRef.get();
	if (joinedRoomRef && joinedRoomDoc.exists) {
		const data = joinedRoomDoc.data() as IJoinedRoom;
		if (data) {
			if (!data.is_joined) {
				return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE_ALREADY_LEFT('Room',roomId) });
			} else {
				if (data.joined_at) {
					leavedRoom.joined_at = data.joined_at;
				}
			}
		} else {
			return res.status(StatusCodes.NOT_FOUND).json({ error: messages.UNABLE_TO_FIND_ROOM_DATA(roomId) });
		}
	} else {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE_NOT_JOINED('Room',roomId) });
	}

	await joinedRoomRef.set(leavedRoom, { merge: true });

	const data = roomRefDoc.data() as IRoom;
	const numTotalMembers = Number(data.total_members || 0);
	const room: IRoom = {
		...data,
		total_members: (numTotalMembers > 0? numTotalMembers - 1: 0)
	};
	await roomRef.set(room, { merge: true });

	res.status(StatusCodes.OK).json({
		updatedRoom: room
	});
};

export default withErrorHandling(handler);