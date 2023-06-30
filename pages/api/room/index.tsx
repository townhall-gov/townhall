// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM } from '~src/global/min_token';
import { ICreatorDetails } from '~src/redux/rooms/@types';
import { roomCollection } from '~src/services/firebase/utils';
import { IRoom } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';
import { getErrorStatus } from '~src/utils/getErrorMessage';

interface IGetRoomFnParams {
    house_id: string;
    room_id: string;
}

export type TGetRoomFn = (params: IGetRoomFnParams) => Promise<TApiResponse<IRoom>>;
export const getRoom: TGetRoomFn = async (params) => {
	try {
		const { house_id, room_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode('Invalid roomId.', StatusCodes.BAD_REQUEST);
		}
		const roomDocSnapshot = await roomCollection(house_id).doc(room_id).get();
		const data = roomDocSnapshot?.data() as IRoom;
		if (!roomDocSnapshot || !roomDocSnapshot.exists || !data) {
			throw apiErrorWithStatusCode(`Room with id ${room_id} is not found in house with id ${house_id}.`, StatusCodes.NOT_FOUND);
		}

		// Sanitization
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
		return {
			data: JSON.parse(JSON.stringify(room)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: getErrorStatus(error)
		};
	}
};

export interface IRoomBody {}
export interface IRoomQuery {
    house_id: string;
    room_id: string;
}
const handler: TNextApiHandler<IRoom, IRoomBody, IRoomQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { house_id, room_id } = req.query;
	const {
		data: room,
		error,
		status
	} = await getRoom({ house_id, room_id });

	if (room && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(room);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);