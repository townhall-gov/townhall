// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { IRoomSettings } from '~src/redux/room/@types';
import { roomCollection } from '~src/services/firebase/utils';
import { IRoom } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export interface IRoomSettingsBody {
    houseId: string;
    roomId: string;
    roomSettings: IRoomSettings;
}

export interface IRoomSettingsResponse {
	updatedRoom: IRoom;
}

const handler: TNextApiHandler<IRoomSettingsResponse, IRoomSettingsBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { houseId, roomId, roomSettings } = req.body;

	if (!houseId || typeof houseId !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid houseId.' });
	}

	if (!roomId || typeof roomId !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid roomId.' });
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

	const roomRef = roomCollection(houseId).doc(roomId);
	const roomRefDoc = await roomRef.get();

	if (!roomRefDoc || !roomRefDoc.exists || !roomRefDoc.data()) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: `Room "${roomId}" is not found in house "${houseId}".` });
	}

	const data = roomRefDoc.data() as IRoom;
	if (data.creator_details.address !== address) {
		return res.status(StatusCodes.FORBIDDEN).json({ error: 'Only creator can update room settings.' });
	}

	if (roomSettings) {
		const { min_token_to_create_proposal_in_room } = roomSettings;
		const room: IRoom = {
			...data,
			min_token_to_create_proposal_in_room: (min_token_to_create_proposal_in_room || min_token_to_create_proposal_in_room === 0)? min_token_to_create_proposal_in_room: data.min_token_to_create_proposal_in_room
		};
		await roomRef.set(room, { merge: true });
		return res.status(StatusCodes.OK).json({
			updatedRoom: room
		});
	}

	res.status(StatusCodes.OK).json({
		updatedRoom: data
	});
};

export default withErrorHandling(handler);