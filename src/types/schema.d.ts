// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ICreatorDetails, IProjectSocial } from '~src/redux/rooms/@types';
import { EBlockchain, EWallet, ESentiment, EStrategy, EReaction } from '~src/types/enums';

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
	logo?: string;
	blockchain: EBlockchain;
	total_rooms: number;
}

interface IRoom {
	id: string;
	house_id: string;
	title: string;
	description: string;
	logo?: string;
	contract_address: string;
	total_members: number;
	socials: IProjectSocial[];
	creator_details: ICreatorDetails;
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
	strategy: EStrategy;
	proposer_address: string;
	created_at: Date;
	updated_at: Date;
	start_date: number;
	end_date: number;
	preparation_period: number;
	is_vote_results_hide_before_voting_ends: boolean;
	timestamp: number;
	reactions: IReaction[];
	comments: IComment[];
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

interface IVote {
	proposal_id: number;
	user_address: string;
	signature: string;
	note?: string;
	block_number: number;
	balance_at_proposal_start_block_number: number;
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
	IReaction
};