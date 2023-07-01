// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { voteCollection } from '~src/services/firebase/utils';
import { IVote } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IGetVotesFnParams {
    house_id: string;
    room_id: string;
    proposal_id: number;
}

export type TGetVotesFn = (params: IGetVotesFnParams) => Promise<TApiResponse<IVote[]>>;
export const getVotes: TGetVotesFn = async (params) => {
	try {
		const { house_id, proposal_id, room_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('house'), StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('house'), StatusCodes.BAD_REQUEST);
		}
		if (!(proposal_id == 0) && !proposal_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('proposal'), StatusCodes.BAD_REQUEST);
		}

		const votes: IVote[] = [];
		const votesQuerySnapshot = await voteCollection(house_id, room_id, String(proposal_id)).get();

		votesQuerySnapshot.docs.forEach((doc) => {
			const voteData = doc.data() as IVote;
			if (voteData) {
				const currVote: IVote = {
					...voteData,
					created_at: convertFirestoreTimestampToDate(voteData.created_at)
				};
				delete (currVote as any).signature;
				votes.push(currVote);
			}
		});

		return {
			data: JSON.parse(JSON.stringify(votes)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: (error.name? Number(error.name): StatusCodes.INTERNAL_SERVER_ERROR)
		};
	}
};

export interface IVotesInfoBody {}
export interface IVotesInfoQuery {
    house_id: string;
    room_id: string;
    proposal_id: number;
}

const handler: TNextApiHandler<IVote[], IVotesInfoBody, IVotesInfoQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('GET') });
	}
	const { house_id, proposal_id, room_id } = req.query;
	const {
		data: votes,
		error,
		status
	} = await getVotes({ house_id, proposal_id, room_id  });

	if (votes && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(votes);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);