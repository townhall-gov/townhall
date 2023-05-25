// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { ICreatorDetails } from '~src/redux/rooms/@types';
import { roomCollection } from '~src/services/firebase/utils';
import { IRoom } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

interface ICustomRoom extends Omit<IRoom, 'created_at' | 'total_members' | 'creator_details'> {
    creator_details: Omit<ICreatorDetails, 'address'>
}
export interface ICreateRoomBody {
    room: ICustomRoom;
}

export interface ICreateRoomResponse {
	createdRoom: IRoom;
}

const handler: TNextApiHandler<ICreateRoomResponse, ICreateRoomBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { room } = req.body;

	if (!room) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid room details.' });
	}

	if (!room.house_id || typeof room.house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid houseId.' });
	}

	let address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid token' });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid address.' });
	}

	const { house_id, id } = room;
	const roomRef = roomCollection(house_id).doc(id);
	const roomRefDoc = await roomRef.get();

	if (roomRefDoc && roomRefDoc.exists) {
		const data = roomRefDoc.data() as IRoom;
		if (data && data.house_id === house_id) {
			return res.status(StatusCodes.NOT_FOUND).json({ error: `Room ${id} is already exists in a house ${house_id}.` });
		}
	}

	const createdRoom: IRoom = {
		...room,
		created_at: new Date(),
		creator_details: {
			...room.creator_details,
			address
		},
		total_members: 0
	};
	await roomRef.set(createdRoom, { merge: true });

	res.status(StatusCodes.OK).json({
		createdRoom
	});
};

export default withErrorHandling(handler);