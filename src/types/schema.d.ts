// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ICreatorDetails, IProjectSocial } from '~src/redux/rooms/@types';
import { EBlockchain, EWallet, ESentiment, EStrategy } from '~src/types/enums';

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

interface IJoinedRoom {
	house_id: string;
	room_id: string;
	joined_at: Date;
	leaved_at: Date | null;
	is_joined: boolean;
}

interface IHouse {
	id: string;
	title: string;
	description: string;
	logo?: string;
	blockchain: EBlockchain;
	total_members: number;
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
	room_id: number;
	title: string;
	description: string;
	strategy: EStrategy;
	start: Date;
	end: Date;
}

interface IComment {
	id: string;
	proposal_id: number;
	body: string;
	user_address: string;
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
	IProposal,
	ISentiment,
	ITag,
	IVote,
	IJoinedHouse,
	IJoinedRoom
};