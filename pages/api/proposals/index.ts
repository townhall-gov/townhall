// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { proposalCollection } from '~src/services/firebase/utils';
import { IProposal } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IGetProposalsFnParams {
    house_id: string;
    room_id: string;
}

export type TGetProposalsFn = (params: IGetProposalsFnParams) => Promise<TApiResponse<IProposal[]>>;
export const getProposals: TGetProposalsFn = async (params) => {
	try {
		const { house_id, room_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode('Invalid roomId.', StatusCodes.BAD_REQUEST);
		}
		const proposals: IProposal[] = [];
		const proposalsSnapshot = await proposalCollection(house_id, room_id).get();
		if (proposalsSnapshot.size > 0) {
			proposalsSnapshot.docs.forEach((doc) => {
				if (doc && doc.exists) {
					const data = doc.data() as IProposal;
					if (data) {
						// Sanitization
						if ((data.id || data.id == 0) && data.house_id && data.room_id && data.proposer_address) {
							const proposal: IProposal = {
								created_at: convertFirestoreTimestampToDate(data.created_at),
								description: data.description || '',
								discussion: data.discussion || '',
								end_date: data.end_date || 0,
								house_id: data.house_id,
								id: data.id,
								is_vote_results_hide_before_voting_ends: data.is_vote_results_hide_before_voting_ends || false,
								preparation_period: data.preparation_period,
								proposer_address: data.proposer_address,
								room_id: data.room_id,
								start_date: data.start_date || 0,
								strategy: data.strategy,
								tags: data.tags || [],
								timestamp: data.timestamp || 0,
								title: data.title || '',
								updated_at: convertFirestoreTimestampToDate(data.updated_at)
							};
							proposals.push(proposal);
						}
					}
				}
			});
		}
		return {
			data: JSON.parse(JSON.stringify(proposals)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: (error.name? Number(error.name): StatusCodes.INTERNAL_SERVER_ERROR)
		};
	}
};

export interface IProposalsBody {}
export interface IProposalsQuery {
    house_id: string;
    room_id: string;
}
const handler: TNextApiHandler<IProposal[], IProposalsBody, IProposalsQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { house_id, room_id } = req.query;
	const {
		data: proposals,
		error,
		status
	} = await getProposals({ house_id, room_id });

	if (proposals && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(proposals);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);