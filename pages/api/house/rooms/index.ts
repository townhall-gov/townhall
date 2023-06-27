// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { houseCollection, roomCollection } from '~src/services/firebase/utils';
import { IHouse } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import getErrorMessage from '~src/utils/getErrorMessage';
import { getErrorStatus } from '~src/utils/getErrorMessage';

interface IGetHouseRoomsFnParams {
    house_id: string;
}

export type TGetHouseRoomsFn = (params: IGetHouseRoomsFnParams) => Promise<TApiResponse<IHouseRoom[]>>;
export const getHouseRooms: TGetHouseRoomsFn = async (params) => {
	try {
		const { house_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		const houseDocSnapshot = await houseCollection.doc(house_id).get();
		const data = houseDocSnapshot?.data() as IHouse;
		if (!houseDocSnapshot || !houseDocSnapshot.exists || !data) {
			throw apiErrorWithStatusCode(`House "${house_id}" not found.`, StatusCodes.NOT_FOUND);
		}

		const houseRooms: IHouseRoom[] = [];
		const roomQuerySnapshot = await roomCollection(data.id).get();
		roomQuerySnapshot.docs.forEach((doc) => {
			if (doc && doc.exists) {
				const data = doc.data() as IHouse;
				if (data) {
					// Sanitization
					const room: IHouseRoom = {
						id: data.id,
						logo: data.logo,
						title: data.title
					};
					houseRooms.push(room);
				}
			}
		});

		return {
			data: JSON.parse(JSON.stringify(houseRooms)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: getErrorStatus(error)
		};
	}
};

export interface IHouseRoom {
    id: string;
    logo: string;
    title: string;
}
export interface IHouseRoomsBody {}
export interface IHouseRoomsQuery {
    house_id: string;
}
const handler: TNextApiHandler<IHouseRoom[], IHouseRoomsBody, IHouseRoomsQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { house_id } = req.query;
	const {
		data: houseRooms,
		error,
		status
	} = await getHouseRooms({ house_id });

	if (houseRooms && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(houseRooms);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);