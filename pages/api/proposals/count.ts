// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse, TNextApiHandler } from '~src/api/types';
import { proposalCollection } from '~src/services/firebase/utils';
import { EProposalStatus } from '~src/types/enums';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IGetProposalsCountFnParams {
    house_id: string;
    room_id: string;
	filter_by?: string;
}

export type TGetProposalsCountFn = (params: IGetProposalsCountFnParams) => Promise<TApiResponse<number>>;
export const getProposalsCount: TGetProposalsCountFn = async (params) => {
	try {
		const { house_id, room_id, filter_by } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode('Invalid roomId.', StatusCodes.BAD_REQUEST);
		}
		let count = 0;
		let proposalsQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = proposalCollection(house_id, room_id);
		if (filter_by && [EProposalStatus.ACTIVE.toString(), EProposalStatus.PENDING.toString(), EProposalStatus.CLOSED.toString()].includes(filter_by)) {
			proposalsQuery = proposalCollection(house_id, room_id).where('status', '==', filter_by);
		}
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
export interface IProposalsCountBody {}
export interface IProposalsCountQuery {
    house_id: string;
    room_id: string;
	filter_by?: string;
}
const handler: TNextApiHandler<number, IProposalsCountBody, IProposalsCountQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { house_id, room_id, filter_by } = req.query;
	const {
		data: count,
		error,
		status
	} = await getProposalsCount({ filter_by, house_id, room_id });

	if ((count || count === 0) && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(count);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);