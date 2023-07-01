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
import { IProposal, IVote, IVotesResult } from '~src/types/schema';
import { calculateStrategy } from '~src/utils/calculation/getStrategyWeight';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export type TVotePayload = Omit<IVote, 'created_at' | 'id' | 'voter_address'>;

export interface IVoteBody {
    vote: TVotePayload;
	voter_address: string;
    signature: string;
}

export interface IVoteResponse {
	createdVote: IVote;
	votes_result: IVotesResult;
}

const handler: TNextApiHandler<IVoteResponse, IVoteBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}

	const { vote, signature, voter_address } = req.body;

	if (!vote || typeof vote !== 'object') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.UNABLE_TO_TYPE1_DUE_TYPE2('Vote','insufficient information.') });
	}

	if (!signature) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('signature') });
	}

	if (!voter_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('voter address') });
	}

	const { house_id, room_id, proposal_id } = vote;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('house') });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('room') });
	}

	const numProposalId = Number(proposal_id);
	if (isNaN(numProposalId)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('proposal') });
	}

	let logged_in_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('token') });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		logged_in_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (voter_address !== logged_in_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.LOGGED_IN_ADDRESS_DOES_NOT_MATCH('Voters') });
	}

	const houseDocSnapshot = await houseCollection.doc(house_id).get();
	if (!houseDocSnapshot.exists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_NOT_FOUND('House',house_id) });
	}

	const roomDocSnapshot = await roomCollection(house_id).doc(room_id).get();
	if (!roomDocSnapshot.exists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE1_NOT_FOUND_IN_TYPE2('Room',room_id,'house',house_id) });
	}

	const proposalDocRef = proposalCollection(house_id, room_id).doc(String(proposal_id));
	const proposalDocSnapshot = await proposalDocRef.get();
	const proposalData = proposalDocSnapshot.data() as IProposal;
	if (!proposalDocSnapshot.exists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Proposal',proposal_id,room_id,house_id) });
	}

	const isAllZero = vote.balances.every((balance) => new BigNumber(balance.value).eq(0));
	if (isAllZero) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.UNABLE_TO_TYPE1_DUE_TYPE2('vote',', All Strategies are not satisfy.') });
	}
	const voteColRef = voteCollection(house_id, room_id, String(proposal_id));
	const voteQuerySnapshot = await voteColRef.where('voter_address', '==', voter_address).limit(0).get();
	if (!voteQuerySnapshot.empty) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.ALREADY_VOTED(voter_address) });
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
		votes_result[option.value] = (votes_result[option.value] || []).map((optionResult) => {
			let prev = (new BigNumber(optionResult.value || '0'));
			const balance = vote.balances.find((item) => item.id === optionResult.id);
			const strategy = proposalData.voting_strategies_with_height.find((item) => item.id === optionResult.id);
			if (strategy) {
				let weight = new BigNumber(strategy?.weight || '0');
				if (weight.eq(0)) {
					weight = new BigNumber(1);
				}
				const current = new BigNumber(balance?.value || '0').multipliedBy(weight);
				const result = calculateStrategy({
					...strategy,
					value: current.toString() || '0'
				});
				prev = prev.plus(result);
			} else {
				prev = prev.plus(balance?.value || '0');
			}
			return {
				...optionResult,
				value: prev.toString()
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