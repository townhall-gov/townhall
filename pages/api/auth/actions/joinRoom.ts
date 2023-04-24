// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import { joinedRoomCollection, roomCollection } from '~src/services/firebase/utils';
import { IRoom, IJoinedRoom } from '~src/types/schema';

export interface IJoinRoomBody {
    address: string;
    houseId: string;
    roomId: string;
}

export interface IJoinRoomResponse {
	updatedRoom: IRoom;
	joinedRoom: IJoinedRoom;
}

const handler: TNextApiHandler<IJoinRoomResponse, IJoinRoomBody> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { address, houseId, roomId } = req.body;

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid address.' });
	}

	if (!houseId || typeof houseId !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid houseId.' });
	}

	if (!roomId || typeof roomId !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid roomId.' });
	}

	const roomRef = roomCollection(houseId).doc(roomId);
	const roomRefDoc = await roomRef.get();

	if (!roomRefDoc || !roomRefDoc.exists || !roomRefDoc.data()) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: `Room with id ${roomId} is not found in a house with id ${houseId}.` });
	}

	const joinedRoom: IJoinedRoom = {
		house_id: houseId,
		is_joined: true,
		joined_at: new Date(),
		leaved_at: null,
		room_id: roomId
	};

	const joinedRoomRef = joinedRoomCollection(address, houseId).doc(roomId);
	const joinedRoomDoc = await joinedRoomRef.get();
	if (joinedRoomRef && joinedRoomDoc.exists) {
		const data = joinedRoomDoc.data() as IJoinedRoom;
		if (data) {
			if (data.is_joined) {
				return res.status(StatusCodes.NOT_FOUND).json({ error: `Room with id ${roomId} is already joined.` });
			} else {
				if (data.joined_at) {
					joinedRoom.joined_at = data.joined_at;
				}
				if (data.leaved_at) {
					joinedRoom.leaved_at = data.leaved_at;
				}
			}
		}
	}

	await joinedRoomRef.set(joinedRoom, { merge: true });

	const data = roomRefDoc.data() as IRoom;
	const room: IRoom = {
		...data,
		total_members: Number(data.total_members || 0) + 1
	};
	await roomRef.set(room, { merge: true });

	res.status(StatusCodes.OK).json({
		joinedRoom,
		updatedRoom: room
	});
};

export default withErrorHandling(handler);