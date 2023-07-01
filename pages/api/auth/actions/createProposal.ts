// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { getHeightUsingStrategy } from '~src/onchain-data';
import { discussionCollection, houseCollection, proposalCollection, roomCollection } from '~src/services/firebase/utils';
import { EPostType, EProposalStatus, EReaction } from '~src/types/enums';
import { IDiscussion, IProposal, IRoom, IStrategyWithHeight, IVotesResult } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';
import { TUpdatedPost } from './postLink';

export type TProposalPayload = Omit<IProposal, 'proposer_address' | 'created_at' | 'updated_at' | 'id' | 'timestamp' | 'reactions' | 'comments' | 'snapshot_heights' | 'start_date' | 'end_date' | 'votes_result' | 'voting_strategies_with_height' | 'status' | 'comments_count' | 'reactions_count'> & {
	start_date: string;
	end_date: string;
};

export interface ICreateProposalBody {
    proposal: TProposalPayload;
    signature: string;
    proposer_address: string;
}

export interface ICreateProposalResponse {
	createdProposal: IProposal;
}

const handler: TNextApiHandler<ICreateProposalResponse, ICreateProposalBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}
	const { proposal, proposer_address, signature } = req.body;
	if (!proposal || typeof proposal !== 'object') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.UNABLE_TO_CREATE_TYPE('Proposal') });
	}

	if (!signature) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('signature') });
	}

	if (!proposer_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('address') });
	}

	const { house_id, room_id } = proposal;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('house') });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('room') });
	}

	let logged_in_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('token') });
		}

		const user = await authServiceInstance.GetUser(token);
		if(!user) {
			return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		}
		logged_in_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (proposer_address !== logged_in_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.LOGGED_IN_ADDRESS_DOES_NOT_MATCH('Proposer') });
	}

	const houseDocSnapshot = await houseCollection.doc(house_id).get();
	if (!houseDocSnapshot.exists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_NOT_FOUND('House',house_id) });
	}

	const roomDocSnapshot = await roomCollection(house_id).doc(room_id).get();
	const roomData = roomDocSnapshot.data() as IRoom;
	if (!roomDocSnapshot.exists || !roomData) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Room',room_id,'house',house_id) });
	}

	if (roomData.voting_strategies.length === 0) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.NO_VOTING_ROOM_STRATEGY(room_id) });
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
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_ALREADY_IN_ROOM_AND_HOUSE('Proposal',newID,room_id,house_id) });
	}

	// TODO: Multiple strategies can have same network, so we need to filter the unique network.
	const networks: {
		[key: string]: IStrategyWithHeight[]
	} = {};
	roomData.voting_strategies.forEach((strategy) => {
		if (!networks[strategy.network]) {
			networks[strategy.network] = [];
		}
		networks[strategy.network].push({
			...strategy,
			height: 0
		});
	});

	const heightsPromise = Object.entries(networks).map(async ([, strategies]) => {
		const data: any = await Promise.race([
			getHeightUsingStrategy(strategies[0], new Date(proposal.start_date).getTime()),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('timeout')), 60 * 1000)
			)
		]);

		return strategies.map((strategy) => {
			return {
				...strategy,
				height: data.height
			};
		});
	});

	const heightsPromiseSettledResult = await Promise.allSettled(heightsPromise);

	const voting_strategies_with_height: IStrategyWithHeight[] = [];

	heightsPromiseSettledResult.forEach((result) => {
		if (result && result.status === 'fulfilled' && result.value) {
			voting_strategies_with_height.push(...(result.value as IStrategyWithHeight[]));
		}
	});

	if (voting_strategies_with_height.length === 0) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.UNABLE_TO_GET_SNAPSHOT_HEIGHT(room_id,house_id) });
	}

	const now = new Date();
	const newProposal: Omit<IProposal, 'comments' | 'reactions'> = {
		...proposal,
		comments_count: 0,
		created_at: now,
		end_date: new Date(proposal.end_date),
		id: newID,
		proposer_address: proposer_address,
		reactions_count: {
			[EReaction.DISLIKE]: 0,
			[EReaction.LIKE]: 0
		},
		start_date: new Date(proposal.start_date),
		status: EProposalStatus.PENDING,
		updated_at: now,
		votes_result: proposal.voting_system_options.reduce((prev, option) => {
			return {
				...prev,
				[option.value]: roomData.voting_strategies.map((strategy) => {
					return {
						id: strategy.id,
						value: 0
					};
				})
			};
		}, {} as IVotesResult),
		voting_strategies_with_height: voting_strategies_with_height
	};

	if (proposal.post_link && proposal.post_link_data) {
		const { post_link } = proposal;
		const updatedLinkedPost: TUpdatedPost = {
			post_link: {
				house_id,
				post_id: newID,
				post_type: EPostType.PROPOSAL,
				room_id
			},
			post_link_data: {
				description: newProposal.description,
				tags: newProposal.tags,
				title: newProposal.title
			},
			updated_at: now
		};

		const linkPostsColRef = discussionCollection(post_link.house_id, post_link.room_id);
		const linkPostDocRef = linkPostsColRef.doc(String(post_link.post_id));
		const linkPostDoc = await linkPostDocRef.get();
		const linkPostData = linkPostDoc.data() as IDiscussion;
		if (!linkPostDoc.exists || !linkPostData) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Post',post_link.post_id,post_link.room_id,post_link.house_id) });
		}

		if (linkPostData.post_link || linkPostData.post_link_data) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.ALREADY_POST_LINK(post_link.post_id) });
		}

		linkPostDocRef.set(updatedLinkedPost, { merge: true }).then(() => {});
	}

	await proposalDocRef.set({
		...newProposal,
		signature
	}, { merge: true });

	res.status(StatusCodes.OK).json({
		createdProposal: {
			...newProposal,
			comments: [],
			reactions: [],
			voting_strategies_with_height: voting_strategies_with_height || []
		}
	});
};

export default withErrorHandling(handler);