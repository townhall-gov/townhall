// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IPostLinkData } from 'pages/api/auth/data/post-link-data';
import { IVotingSystemOption } from '~src/redux/room/@types';
import { ICreatorDetails, IProjectSocial, IStrategy } from '~src/redux/rooms/@types';
import { EBlockchain, EWallet, ESentiment, EVotingSystem, EReaction, EProposalStatus, EPostType } from '~src/types/enums';

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
	min_token_to_create_room?: number;
	logo: string;
	blockchain: EBlockchain;
	networks: INetwork[];
	is_erc20: boolean;
	total_room: number;
	admins: IAdmin[];
}

interface IAdmin {
	addresses: string[];
	name: string;
}

interface INetwork {
	name: string;
	blockTime: number;
	decimals: number;
	symbol: string;
	isEVM: boolean;
}

interface IRoom {
	id: string;
	house_id: string;
	title: string;
	description: string;
	logo: string;
	total_members: number;
	socials: IProjectSocial[];
	creator_details: ICreatorDetails;
	admins: IAdmin[];
	voting_strategies: IStrategy[];
	created_at: Date;
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
	is_vote_results_hide_before_voting_ends: boolean;
	reactions: IReaction[];
	comments: IComment[];
	comments_count: number;
	reactions_count: {
		[EReaction.DISLIKE]: number;
		[EReaction.LIKE]: number;
	};
	votes_result: IVotesResult;
	voting_strategies_with_height: IStrategyWithHeight[];
	status: EProposalStatus;
	post_link: IPostLink | null;
	post_link_data: IPostLinkData | null;
}

export interface IStrategyWithHeight extends IStrategy {
	height: number;
}

interface IDiscussion {
	id: number;
	house_id: string;
	room_id: string;
	title: string;
	description: string;
    tags: string[];
	proposer_address: string;
	created_at: Date;
	updated_at: Date;
	comments_count: number;
	reactions_count: {
		[EReaction.DISLIKE]: number;
		[EReaction.LIKE]: number;
	};
	reactions: IReaction[];
	comments: IComment[];
	post_link: IPostLink | null;
	post_link_data: IPostLinkData | null;
}

interface IPostLink {
	house_id: string;
	room_id: string;
	post_id: number;
	post_type: EPostType;
}

interface IVotesResult {
	[key: string]: IBalance[];
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
	balances: IBalance[];
}

interface IBalance {
	id: string;
	value: number | string;
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
	post_id: number;
	post_type: EPostType;
	room_id: string;
	house_id: string;
	content: string;
	user_address: string;
	history: IHistoryComment[];
	reactions: IReaction[];
	sentiment: ESentiment | null;
	replies: IReply[] | null;
}

interface IReply {
	id: string;
	is_deleted: boolean;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date | null;
	comment_id: string;
	post_id: number;
	post_type: EPostType;
	room_id: string;
	house_id: string;
	content: string;
	user_address: string;
	history: IHistoryReply[];
	reactions: IReaction[];
	sentiment: ESentiment | null;
}

interface IHistoryComment {
	created_at: Date;
	sentiment: ESentiment | null;
	content: string;
}

interface IHistoryReply {
	created_at: Date;
	sentiment: ESentiment | null;
	content: string;
}

interface ITag {
	title: string;
	post_id: number;
}

interface ISentiment {
	post_id: number;
	user_address: string;
	sentiment: ESentiment
}

export {
	IHouse,
	IAdmin,
	IUser,
	IRoom,
	IComment,
	IHistoryComment,
	IReply,
	IHistoryReply,
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
	IBalance,
	IVote,
	IVotesResult,
	IDiscussion,
	IPostLink
};