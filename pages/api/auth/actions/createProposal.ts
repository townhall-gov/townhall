// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { height } from '~src/onchain-data';
import { clean, create } from '~src/onchain-data/utils/apis';
import { houseCollection, proposalCollection, roomCollection } from '~src/services/firebase/utils';
import { IProposal, IRoom, ISnapshotHeight, IVotesResult } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export type TProposalPayload = Omit<IProposal, 'proposer_address' | 'created_at' | 'updated_at' | 'id' | 'timestamp' | 'reactions' | 'comments' | 'snapshot_heights' | 'start_date' | 'end_date' | 'votes_result' | 'voting_strategies'> & {
	start_date: string;
	end_date: string;
};

export interface ICreateProposalBody {
    proposal: TProposalPayload & {
        timestamp: number;
    };
    signature: string;
    proposer_address: string;
}

export interface ICreateProposalResponse {
	createdProposal: IProposal;
}

const handler: TNextApiHandler<ICreateProposalResponse, ICreateProposalBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { proposal, proposer_address, signature } = req.body;
	create();
	if (!proposal || typeof proposal !== 'object') {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Unable to create a proposal, insufficient information for creating a proposal.' });
	}

	if (!signature) {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid signature.' });
	}

	if (!proposer_address) {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid address.' });
	}

	const { house_id, room_id } = proposal;

	if (!house_id || typeof house_id !== 'string') {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid houseId.' });
	}

	if (!room_id || typeof room_id !== 'string') {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid roomId.' });
	}

	let logged_in_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) {
			clean();
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid token' });
		}

		const user = await authServiceInstance.GetUser(token);
		if(!user) {
			clean();
			return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		}
		logged_in_address = user.address;
	} catch (error) {
		clean();
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (proposer_address !== logged_in_address) {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'LoggedIn address is not matching with Proposer address' });
	}

	const houseDocSnapshot = await houseCollection.doc(house_id).get();
	if (!houseDocSnapshot.exists) {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `House with id ${house_id} does not exist.` });
	}

	const roomDocSnapshot = await roomCollection(house_id).doc(room_id).get();
	const roomData = roomDocSnapshot.data() as IRoom;
	if (!roomDocSnapshot.exists || !roomData) {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Room with id ${room_id} does not exist in a House with id ${house_id}.` });
	}

	if (roomData.voting_strategies.length === 0) {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Room with id ${room_id} does not have any voting strategies.` });
	}

	let newID = 0;
	const proposalsColRef = proposalCollection(house_id, room_id);
	const lastProposalQuerySnapshot = await proposalsColRef.orderBy('id', 'desc').limit(1).get();
	if (!lastProposalQuerySnapshot.empty && lastProposalQuerySnapshot.docs.length > 0) {
		const lastProposalDoc = lastProposalQuerySnapshot.docs[0];
		if (lastProposalDoc) {
			const lastProposalData = lastProposalDoc.data() as IProposal;
			newID = Number(lastProposalData.id) + 1;
		}
	}

	const proposalDocRef = proposalsColRef.doc(String(newID));
	const proposalDocSnapshot = await proposalDocRef.get();
	if (proposalDocSnapshot && proposalDocSnapshot.exists && proposalDocSnapshot.data()) {
		clean();
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Proposal with id ${newID} already exists in a Room with id ${room_id} and a House with id ${house_id}.` });
	}

	const heightsPromise = roomData.voting_strategies.map(async (strategy) => {
		const { network } = strategy;
		const data: any = await Promise.race([
			height(network, new Date(proposal.start_date).getTime()),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('timeout')), 60 * 1000)
			)
		]);

		return {
			blockchain: network,
			height: data.height
		};
	});

	const heightsPromiseSettledResult = await Promise.allSettled(heightsPromise);
	clean();

	const snapshot_heights: ISnapshotHeight[] = [];

	heightsPromiseSettledResult.forEach((result) => {
		if (result && result.status === 'fulfilled' && result.value) {
			snapshot_heights.push(result.value as ISnapshotHeight);
		}
	});

	if (snapshot_heights.length === 0) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Unable to get snapshot heights for a Room with id ${room_id} and a House with id ${house_id}.` });
	}

	const now = new Date();
	const newProposal: Omit<IProposal, 'comments' | 'reactions' | 'voting_strategies'> = {
		...proposal,
		created_at: now,
		end_date: new Date(proposal.end_date),
		id: newID,
		proposer_address: proposer_address,
		snapshot_heights: snapshot_heights,
		start_date: new Date(proposal.start_date),
		updated_at: now,
		votes_result: proposal.voting_system_options.reduce((prev, option) => {
			return {
				...prev,
				[option.value]: roomData.voting_strategies.map((strategy) => {
					return {
						amount: 0,
						name: strategy.name,
						network: strategy.network
					};
				})
			};
		}, {} as IVotesResult)
	};

	await proposalDocRef.set({
		...newProposal,
		signature
	}, { merge: true });

	res.status(StatusCodes.OK).json({
		createdProposal: {
			...newProposal,
			comments: [],
			reactions: [],
			voting_strategies: roomData.voting_strategies || []
		}
	});
};

export default withErrorHandling(handler);