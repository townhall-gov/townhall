// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { joinedHouseCollection, joinedRoomCollection } from '~src/services/firebase/utils';
import { IJoinedHouse, IJoinedRoom } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

interface IGetJoinedRoomsFnParams {
    address: string;
}

export type TGetJoinedRoomsFn = (params: IGetJoinedRoomsFnParams) => Promise<TApiResponse<IJoinedHouse[]>>;
export const getJoinedRooms: TGetJoinedRoomsFn = async (params) => {
	try {
		const { address } = params;
		if (!address) {
			throw apiErrorWithStatusCode('Invalid address.', StatusCodes.BAD_REQUEST);
		}
		const joinedHouses: IJoinedHouse[] = [];
		const joinedHousesSnapshot = await joinedHouseCollection(address).get();
		if (joinedHousesSnapshot.size > 0) {
			const joinedHousesPromise = joinedHousesSnapshot.docs.map(async (doc) => {
				if (doc && doc.exists) {
					const data = doc.data() as IJoinedHouse;
					if (data) {
						// Sanitization
						const joinedHouse: IJoinedHouse = {
							house_id: data.house_id,
							joined_rooms: []
						};
						const joinedRoomsSnapshot = await joinedRoomCollection(address, data.house_id).where('is_joined', '==', true).get();
						if (joinedRoomsSnapshot.size > 0) {
							joinedRoomsSnapshot.docs.forEach((doc) => {
								if (doc && doc.exists) {
									const data = doc.data() as IJoinedRoom;
									if (data) {
										// Sanitization
										if (data.house_id && data.room_id) {
											const joinedRoom: IJoinedRoom = {
												house_id: data.house_id,
												is_joined: data.is_joined,
												joined_at: convertFirestoreTimestampToDate(data.joined_at),
												leaved_at: convertFirestoreTimestampToDate(data.leaved_at),
												room_id: data.room_id
											};
											joinedHouse.joined_rooms.push(joinedRoom);
										}
									}
								}
							});
						}
						return joinedHouse;
					}
				}
			});
			const joinedHousesPromiseSettledResult = await Promise.allSettled(joinedHousesPromise);
			joinedHousesPromiseSettledResult.forEach((result) => {
				if (result && result.status === 'fulfilled') {
					const joinedHouse = result.value;
					if (joinedHouse) {
						joinedHouses.push(joinedHouse);
					}
				}
			});
		}
		return {
			data: JSON.parse(JSON.stringify(joinedHouses)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: (error.name? Number(error.name): StatusCodes.INTERNAL_SERVER_ERROR)
		};
	}
};

export interface IJoinedRoomsBody {}
export interface IJoinedRoomsQuery {}
const handler: TNextApiHandler<IJoinedHouse[], IJoinedRoomsBody, IJoinedRoomsQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
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
	const {
		data: joinedHouses,
		error,
		status
	} = await getJoinedRooms({ address });

	if (joinedHouses && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(joinedHouses);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);