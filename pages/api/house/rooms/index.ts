// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { ICreatorDetails } from '~src/redux/rooms/@types';
import { houseCollection, roomCollection } from '~src/services/firebase/utils';
import { IHouse, IRoom } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';
import { getErrorStatus } from '~src/utils/getErrorMessage';

interface IGetHouseRoomsFnParams {
    house_id: string;
}

export type TGetHouseRoomsFn = (params: IGetHouseRoomsFnParams) => Promise<TApiResponse<IRoom[]>>;
export const getHouseRooms: TGetHouseRoomsFn = async (params) => {
	try {
		const { house_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('house'), StatusCodes.BAD_REQUEST);
		}
		const houseDocSnapshot = await houseCollection.doc(house_id).get();
		const data = houseDocSnapshot?.data() as IHouse;
		if (!houseDocSnapshot || !houseDocSnapshot.exists || !data) {
			throw apiErrorWithStatusCode(`House "${house_id}" not found.`, StatusCodes.NOT_FOUND);
		}

		const houseRooms: IRoom[] = [];
		const roomsSnapshot = await roomCollection(house_id).get();
		if (roomsSnapshot.size > 0) {
			roomsSnapshot.docs.forEach((doc) => {
				if (doc && doc.exists) {
					const data = doc.data() as IRoom;
					if (data) {
						// Sanitization
						if (data.id && data.house_id) {
							const dataCreatorDetails = data.creator_details;
							const creator_details: ICreatorDetails = {
								address: dataCreatorDetails?.address || '',
								email: dataCreatorDetails?.email || '',
								name: dataCreatorDetails?.name || '',
								phone: dataCreatorDetails?.phone || ''
							};
							const room: IRoom = {
								admins: data.admins || [],
								created_at: convertFirestoreTimestampToDate(data.created_at),
								creator_details: creator_details,
								description: data.description || '',
								house_id: data.house_id,
								id: data.id,
								logo: data.logo,
								socials: data.socials || [],
								title: data.title || '',
								total_members: Number(data.total_members || 0),
								voting_strategies: data.voting_strategies || []
							};
							houseRooms.push(room);
						}
					}
				}
			});
		}

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

export interface IHouseRoomsBody {}
export interface IHouseRoomsQuery {
    house_id: string;
}
const handler: TNextApiHandler<IRoom[], IHouseRoomsBody, IHouseRoomsQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('GET') });
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