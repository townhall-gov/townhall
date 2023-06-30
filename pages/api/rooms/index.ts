// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM } from '~src/global/min_token';
import { ICreatorDetails } from '~src/redux/rooms/@types';
import { roomCollection } from '~src/services/firebase/utils';
import { IRoom } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IGetRoomsFnParams {
    house_id: string;
}

export type TGetRoomsFn = (params: IGetRoomsFnParams) => Promise<TApiResponse<IRoom[]>>;
export const getRooms: TGetRoomsFn = async (params) => {
	try {
		const { house_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode(messages.INVALID_HOUSE_ID, StatusCodes.BAD_REQUEST);
		}
		const rooms: IRoom[] = [];
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
								contract_address: data.contract_address,
								created_at: convertFirestoreTimestampToDate(data.created_at),
								creator_details: creator_details,
								decimals: data.decimals,
								description: data.description || '',
								house_id: data.house_id,
								id: data.id,
								logo: data.logo,
								min_token_to_create_proposal_in_room: data.min_token_to_create_proposal_in_room || MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM,
								socials: data.socials || [],
								symbol: data.symbol,
								title: data.title || '',
								total_members: Number(data.total_members || 0),
								voting_strategies: data.voting_strategies || []
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

export interface IRoomsBody {}
export interface IRoomsQuery {
    house_id: string;
}
const handler: TNextApiHandler<IRoom[], IRoomsBody, IRoomsQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_GET_REQUEST });
	}
	const { house_id } = req.query;
	const {
		data: rooms,
		error,
		status
	} = await getRooms({ house_id });

	if (rooms && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(rooms);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);