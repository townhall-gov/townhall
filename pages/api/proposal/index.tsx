// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { proposalCollection } from '~src/services/firebase/utils';
import { IProposal, IReaction } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';
import { getErrorStatus } from '~src/utils/getErrorMessage';

interface IGetProposalFnParams {
    house_id: string;
    room_id: string;
    proposal_id: number;
}

export type TGetProposalFn = (params: IGetProposalFnParams) => Promise<TApiResponse<IProposal>>;
export const getProposal: TGetProposalFn = async (params) => {
	try {
		const { house_id, room_id, proposal_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode('Invalid roomId.', StatusCodes.BAD_REQUEST);
		}
		if (!proposal_id && !(proposal_id == 0)) {
			throw apiErrorWithStatusCode('Invalid proposalId.', StatusCodes.BAD_REQUEST);
		}
		const proposalDocRef = proposalCollection(house_id, room_id).doc(String(proposal_id));
		const proposalDocSnapshot = await proposalDocRef.get();
		const data = proposalDocSnapshot?.data() as IProposal;
		if (!proposalDocSnapshot || !proposalDocSnapshot.exists || !data) {
			throw apiErrorWithStatusCode(`Proposal with id ${proposal_id} is not found in a room with id ${room_id} and a house with id ${house_id}.`, StatusCodes.NOT_FOUND);
		}

		// Sanitization
		if ((data.id || data.id == 0) && data.house_id && data.room_id && data.proposer_address) {
			const reactions: IReaction[] = [];
			const reactionsQuerySnapshot = await proposalDocRef.collection('reactions').get();
			reactionsQuerySnapshot.docs.forEach((doc) => {
				if (doc && doc.exists) {
					const data  = doc.data() as IReaction;
					if (data && data.user_address && data.id && data.type) {
						reactions.push(data);
					}
				}
			});
			const proposal: IProposal = {
				comments: [],
				created_at: convertFirestoreTimestampToDate(data.created_at),
				description: data.description || '',
				discussion: data.discussion || '',
				end_date: data.end_date || 0,
				house_id: data.house_id,
				id: data.id,
				is_vote_results_hide_before_voting_ends: data.is_vote_results_hide_before_voting_ends || false,
				preparation_period: data.preparation_period,
				proposer_address: data.proposer_address,
				reactions: reactions,
				room_id: data.room_id,
				start_date: data.start_date || 0,
				strategy: data.strategy,
				tags: data.tags || [],
				timestamp: data.timestamp || 0,
				title: data.title || '',
				updated_at: convertFirestoreTimestampToDate(data.updated_at)
			};
			return {
				data: JSON.parse(JSON.stringify(proposal)),
				status: StatusCodes.OK
			};
		}
		return {
			error: 'Invalid proposal data.',
			status: StatusCodes.NO_CONTENT
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: getErrorStatus(error)
		};
	}
};

export interface IProposalBody {}
export interface IProposalQuery {
    house_id: string;
    room_id: string;
    proposal_id: number;
}
const handler: TNextApiHandler<IProposal, IProposalBody, IProposalQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { house_id, room_id, proposal_id } = req.query;
	const {
		data: proposal,
		error,
		status
	} = await getProposal({ house_id, proposal_id, room_id });

	if (proposal && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(proposal);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);