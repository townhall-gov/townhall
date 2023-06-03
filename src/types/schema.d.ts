// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IVotingSystemOption } from '~src/redux/room/@types';
import { ICreatorDetails, IProjectSocial, IStrategy } from '~src/redux/rooms/@types';
import { EBlockchain, EWallet, ESentiment, EVotingSystem, EReaction, EVotingStrategy } from '~src/types/enums';

interface IUser {
	address: string;
	wallet: EWallet;
	username: string | null;
	bio: string | null;
	img_url: string | null;
	joined_houses: IJoinedHouse[];
}

interface IJoinedHouse {
	house_id: string;
	joined_rooms: IJoinedRoom[];
}

interface IJoinedRoom extends IRoom {
	joined_at: Date;
	leaved_at: Date | null;
	is_joined: boolean;
}

interface IJoinedRoomForUser {
	id: string;
	house_id: string;
	leaved_at: Date | null;
	joined_at: Date;
	is_joined: boolean;
}

interface IHouse {
	id: string;
	title: string;
	description: string;
	min_token_to_create_room: number;
	logo: string;
	blockchain: EBlockchain;
	networks: INetwork[];
	is_erc20: boolean;
	total_members: number;
}

interface INetwork {
	name: string;
}

interface IRoom {
	id: string;
	house_id: string;
	title: string;
	description: string;
	logo: string;
	contract_address: string;
	decimals: string | number;
	symbol: string;
	total_members: number;
	socials: IProjectSocial[];
	creator_details: ICreatorDetails;
	voting_strategies: IStrategy[];
	created_at: Date;
	min_token_to_create_proposal_in_room: number;
}

interface IProposal {
	id: number;
	house_id: string;
	room_id: string;
	title: string;
	description: string;
    tags: string[];
	discussion?: string;
	voting_system: EVotingSystem;
	voting_system_options: IVotingSystemOption[];
	proposer_address: string;
	created_at: Date;
	updated_at: Date;
	start_date: Date;
	end_date: Date;
	snapshot_heights: ISnapshotHeight[];
	is_vote_results_hide_before_voting_ends: boolean;
	timestamp: number;
	reactions: IReaction[];
	comments: IComment[];
	votes_result: IVotesResult;
	voting_strategies: IStrategy[];
}

interface IVotesResult {
	[key: string]: {
		name: EVotingStrategy;
		network: string;
		amount: number | string;
	}[];
}

interface IVote {
	id: string;
	proposal_id: number;
	house_id: string;
	room_id: string;
	voter_address: string;
	note?: string;
	created_at: Date;
	options: IVotingSystemOption[];
	balances: IBalanceWithNetwork[];
}

interface IBalanceWithNetwork {
	network: string;
	balance: number | string;
}

interface ISnapshotHeight {
	height: number;
	blockchain: EBlockchain;
}

interface IReaction {
	id: string;
	user_address: string;
	type: EReaction;
}

interface IComment {
	id: string;
	is_deleted: boolean;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date | null;
	proposal_id: number;
	content: string;
	user_address: string;
	history: IHistoryComment[];
	reactions: IReaction[];
	sentiment: ESentiment | null;
}

interface IHistoryComment {
	created_at: Date;
	sentiment: ESentiment | null;
	content: string;
}

interface ITag {
	title: string;
	proposal_id: number;
}

interface ISentiment {
	proposal_id: number;
	user_address: string;
	sentiment: ESentiment
}

export {
	IHouse,
	IUser,
	IRoom,
	IComment,
	IHistoryComment,
	IProposal,
	ISentiment,
	ITag,
	IVote,
	IJoinedHouse,
	IJoinedRoom,
	IJoinedRoomForUser,
	IReaction,
	INetwork,
	ISnapshotHeight,
	IBalanceWithNetwork,
	IVote,
	IVotesResult
};