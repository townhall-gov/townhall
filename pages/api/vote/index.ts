// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { voteCollection } from '~src/services/firebase/utils';
import { IVote } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IGetVoteFnParams {
    house_id: string;
    room_id: string;
    proposal_id: number;
	voter_address: string;
}

export type TGetVoteFn = (params: IGetVoteFnParams) => Promise<TApiResponse<IVote>>;
export const getVote: TGetVoteFn = async (params) => {
	try {
		const { house_id, proposal_id, room_id, voter_address } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		if (!(proposal_id == 0) && !proposal_id) {
			throw apiErrorWithStatusCode('Invalid proposalId.', StatusCodes.BAD_REQUEST);
		}
		let vote: IVote | null = null;
		if (voter_address) {
			const voteQuerySnapshot = await voteCollection(house_id, room_id, String(proposal_id)).where('voter_address', '==', voter_address).limit(1).get();
			if (!voteQuerySnapshot.empty) {
				const voteData = voteQuerySnapshot.docs[0].data() as IVote;
				if (voteData) {
					const currVote: IVote = {
						...voteData,
						created_at: convertFirestoreTimestampToDate(voteData.created_at)
					};
					delete (currVote as any).signature;
					vote = currVote;
				}
			} else {
				return {
					error: `Vote not found for voter ${voter_address}.`,
					status: StatusCodes.NOT_FOUND
				};
			}
		}

		return {
			data: JSON.parse(JSON.stringify(vote)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: (error.name? Number(error.name): StatusCodes.INTERNAL_SERVER_ERROR)
		};
	}
};

export interface IVoteInfoBody {}
export interface IVoteInfoQuery {
    house_id: string;
    room_id: string;
    proposal_id: number;
    voter_address: string;
}

const handler: TNextApiHandler<IVote, IVoteInfoBody, IVoteInfoQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { house_id, proposal_id, room_id, voter_address } = req.query;
	const {
		data: vote,
		error,
		status
	} = await getVote({ house_id, proposal_id, room_id, voter_address  });

	if (vote && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(vote);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);