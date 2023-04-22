// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EBlockchain, EWallet, ESentiment, EStrategy } from '~src/types/enums';
interface IUser {
	address: string;
	wallet: EWallet;
	username: string | null;
	bio: string | null;
	img_url: string | null;
}

interface IHouse {
	id: string;
	title: string;
	description: string;
	logo?: string;
	blockchain: EBlockchain;
}

interface IRoom {
	id: number;
	house_id: number;
	title: string;
	description: string;
	logo: string;
	contract_address: string;
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
	IVote
};