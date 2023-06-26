// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BigNumber from 'bignumber.js';
import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { houseCollection, proposalCollection, roomCollection, voteCollection } from '~src/services/firebase/utils';
import { IVote, IVotesResult } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export type TVotePayload = Omit<IVote, 'created_at' | 'id' | 'voter_address'>;

export interface IVoteBody {
    vote: TVotePayload & {
		timestamp: number;
	};
	voter_address: string;
    signature: string;
}

export interface IVoteResponse {
	createdVote: IVote;
	votes_result: IVotesResult;
}

const handler: TNextApiHandler<IVoteResponse, IVoteBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}

	const { vote, signature, voter_address } = req.body;

	if (!vote || typeof vote !== 'object') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Unable to vote, insufficient information.' });
	}

	if (!signature) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid signature.' });
	}

	if (!voter_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid voter address.' });
	}

	const { house_id, room_id, proposal_id } = vote;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid houseId.' });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid roomId.' });
	}

	const numProposalId = Number(proposal_id);
	if (isNaN(numProposalId)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid proposalId.' });
	}

	let logged_in_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid token' });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		logged_in_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (voter_address !== logged_in_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'LoggedIn address is not matching with Voter address' });
	}

	const houseDocSnapshot = await houseCollection.doc(house_id).get();
	if (!houseDocSnapshot.exists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `House with id ${house_id} does not exist.` });
	}

	const roomDocSnapshot = await roomCollection(house_id).doc(room_id).get();
	if (!roomDocSnapshot.exists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Room with id ${room_id} does not exist in a House with id ${house_id}.` });
	}

	const proposalDocRef = proposalCollection(house_id, room_id).doc(String(proposal_id));
	const proposalDocSnapshot = await proposalDocRef.get();
	if (!proposalDocSnapshot.exists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Proposal with id ${proposal_id} does not exist in a Room with id ${room_id} and House with id ${house_id}.` });
	}

	const isAllZero = vote.balances.every((balance) => balance.value === '0');
	if (isAllZero) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Can not vote, All Strategies are not satisfy.' });
	}
	const voteColRef = voteCollection(house_id, room_id, String(proposal_id));
	const voteQuerySnapshot = await voteColRef.where('voter_address', '==', voter_address).limit(0).get();
	if (!voteQuerySnapshot.empty) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Voter ${voter_address} already voted for this proposal.` });
	}
	const voteDocRef = voteColRef.doc();
	const now = new Date();
	const newVote: IVote = {
		balances: vote.balances.map((balance) => {
			return {
				id: balance.id,
				value: balance.value
			};
		}),
		created_at: now,
		house_id: house_id,
		id: voteDocRef.id,
		options: vote.options,
		proposal_id: proposal_id,
		room_id: room_id,
		voter_address: voter_address
	};

	await voteDocRef.set({
		...newVote,
		signature
	}, { merge: true });

	const votes_result = (proposalDocSnapshot.data()?.votes_result || {}) as IVotesResult;
	newVote.options.forEach((option) => {
		if (!votes_result[option.value]) {
			votes_result[option.value] = vote.balances.map((balance) => {
				return {
					id: balance.id,
					value: balance.value
				};
			});
		}
		votes_result[option.value] = (votes_result[option.value] || []).map((optionResult) => {
			const balance = vote.balances.find((item) => item.id === optionResult.id);
			const value = (new BigNumber(optionResult.value)).plus(new BigNumber(balance?.value || '0'));
			return {
				...optionResult,
				value: value.toString()
			};
		});
	});
	await proposalDocRef.set({
		votes_result: votes_result
	}, { merge: true });

	res.status(StatusCodes.OK).json({
		createdVote: newVote,
		votes_result
	});
};

export default withErrorHandling(handler);