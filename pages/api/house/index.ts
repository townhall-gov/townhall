// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { MIN_TOKEN_TO_CREATE_ROOM } from '~src/global/min_token';
import { houseCollection, roomCollection } from '~src/services/firebase/utils';
import { IHouse } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import getErrorMessage from '~src/utils/getErrorMessage';
import { getErrorStatus } from '~src/utils/getErrorMessage';

interface IGetHouseFnParams {
    house_id: string;
}

export type TGetHouseFn = (params: IGetHouseFnParams) => Promise<TApiResponse<IHouse>>;
export const getHouse: TGetHouseFn = async (params) => {
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

		const roomAggregateQuerySnapshot = await roomCollection(data.id).count().get();
		const totalRoom = roomAggregateQuerySnapshot.data().count || 0;
		// Sanitization
		const house: IHouse = {
			admins: data.admins || [],
			blockchain: data.blockchain,
			description: data.description || '',
			id: data.id,
			is_erc20: data.is_erc20 || false,
			logo: data.logo,
			min_token_to_create_room: data.min_token_to_create_room || MIN_TOKEN_TO_CREATE_ROOM,
			networks: data.networks || [],
			title: data.title || '',
			total_room: Number(totalRoom || 0)
		};
		return {
			data: JSON.parse(JSON.stringify(house)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: getErrorStatus(error)
		};
	}
};

export interface IHouseBody {}
export interface IHouseQuery {
    house_id: string;
}
const handler: TNextApiHandler<IHouse, IHouseBody, IHouseQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { house_id } = req.query;
	const {
		data: house,
		error,
		status
	} = await getHouse({ house_id });

	if (house && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(house);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);