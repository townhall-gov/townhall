// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { roomCollection } from '~src/services/firebase/utils';
import { IRoom } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IGetRoomsFnParams {
    houseId: string;
}

export type TGetRoomsFn = (params: IGetRoomsFnParams) => Promise<TApiResponse<IRoom[]>>;
export const getRooms: TGetRoomsFn = async (params) => {
	try {
		const { houseId } = params;
		if (!houseId) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		const rooms: IRoom[] = [];
		const roomsSnapshot = await roomCollection(houseId).get();
		if (roomsSnapshot.size > 0) {
			roomsSnapshot.docs.forEach((doc) => {
				if (doc && doc.exists) {
					const data = doc.data() as IRoom;
					if (data) {
						// Sanitization
						if (data.id && data.house_id) {
							const room: IRoom = {
								contract_address: data.contract_address,
								description: data.description || '',
								house_id: data.house_id,
								id: data.id,
								logo: data.logo,
								title: data.title || '',
								total_members: Number(data.total_members || 0)
							};
							rooms.push(room);
						}
					}
				}
			});
		}
		return {
			data: JSON.parse(JSON.stringify(rooms)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: (error.name? Number(error.name): StatusCodes.INTERNAL_SERVER_ERROR)
		};
	}
};

export interface IRoomsBody {
    houseId: string;
}
const handler: TNextApiHandler<IRoom[], IRoomsBody> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { houseId } = req.body;
	const {
		data: rooms,
		error,
		status
	} = await getRooms({ houseId });

	if (rooms && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(rooms);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler);