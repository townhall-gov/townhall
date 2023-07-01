// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse, TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { proposalCollection } from '~src/services/firebase/utils';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IGetDiscussionsCountFnParams {
    house_id: string;
    room_id: string;
}

export type TGetDiscussionsCountFn = (params: IGetDiscussionsCountFnParams) => Promise<TApiResponse<number>>;
export const getDiscussionsCount: TGetDiscussionsCountFn = async (params) => {
	try {
		const { house_id, room_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('house'), StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('room'), StatusCodes.BAD_REQUEST);
		}
		let count = 0;
		const proposalsQuery = proposalCollection(house_id, room_id);
		const proposalsCountSnapshot = await proposalsQuery.count().get();
		count = proposalsCountSnapshot.data().count || 0;
		return {
			data: JSON.parse(JSON.stringify(count)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: (error.name? Number(error.name): StatusCodes.INTERNAL_SERVER_ERROR)
		};
	}
};
export interface IDiscussionsCountBody {}
export interface IDiscussionsCountQuery {
    house_id: string;
    room_id: string;
}
const handler: TNextApiHandler<number, IDiscussionsCountBody, IDiscussionsCountQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('GET') });
	}
	const { house_id, room_id } = req.query;
	const {
		data: count,
		error,
		status
	} = await getDiscussionsCount({ house_id, room_id });

	if ((count || count === 0) && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(count);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);