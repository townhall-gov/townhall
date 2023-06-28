// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BigNumber from 'bignumber.js';
import { IStrategyWithHeightAndBalance } from 'pages/api/chain/actions/balance';
import { evmChains } from '~src/onchain-data/networkConstants';
import { IVotingSystemOption } from '~src/redux/room/@types';
import { formatToken } from '../formatTokenAmount';

export interface TVotePayload {
    balances: IStrategyWithHeightAndBalance[];
    house_id: string;
    room_id: string;
    proposal_id: number;
    note?: string;
    options: IVotingSystemOption[];
}

interface IVoteTypedData {
	domain: {
		name: string;
		version: string;
	}
    types: {
		EIP712Domain: [
			{ name: 'name', type: 'string' },
			{ name: 'version', type: 'string' }
		],
        VotePayload: VotePayload[];
        VotingSystemOption: VotingSystemOption[];
        Balance: Balance[];
    };
    primaryType: 'VotePayload';
    message: VotePayloadData;
}

interface VotePayload {
    name: string;
    type: string;
}

interface VotingSystemOption {
    name: string;
    type: string;
}

interface Balance {
    name: string;
    type: string;
}

interface VotePayloadData {
    proposal: number;
    house: string;
    room: string;
    note?: string;
    options: VotingSystemOptionData[];
    balances: BalanceData[];
}

interface VotingSystemOptionData {
    value: string;
}

interface BalanceData {
    chain: string;
    strategy: string;
    value: string;
}

export const getVoteTypeData: (votePayload: TVotePayload, isEVM: boolean) => IVoteTypedData | VotePayloadData = (votePayload, isEVM) => {
	const balances = votePayload.balances.map((balance) => {
		const tokenMetadata = balance.token_metadata[balance.asset_type];
		if (!tokenMetadata) return {
			chain: balance.network,
			strategy: balance.name,
			value: '0'
		};
		const formattedToken = new BigNumber(formatToken(balance.value, !!evmChains[balance.network as keyof typeof evmChains], tokenMetadata?.decimals));
		if (formattedToken.lt(new BigNumber(balance.threshold))) {
			return {
				chain: balance.network,
				strategy: balance.name,
				value: '0'
			};
		}
		return {
			chain: balance.network,
			strategy: balance.name,
			value: `${formattedToken.toFixed(2).trim()} ${tokenMetadata?.symbol}`
		};
	});
	if (!isEVM) {
		return {
			balances,
			house: votePayload.house_id,
			note: votePayload.note || '',
			options: votePayload.options,
			proposal: votePayload.proposal_id,
			room: votePayload.room_id
		};
	}

	const typedData: IVoteTypedData = {
		domain: {
			name: 'townhall',
			version: '0.0.1'
		},
		message: {
			balances: balances,
			house: votePayload.house_id,
			note: votePayload.note || '',
			options: votePayload.options,
			proposal: votePayload.proposal_id,
			room: votePayload.room_id
		},
		primaryType: 'VotePayload',
		types: {
			Balance: [
				{ name: 'chain', type: 'string' },
				{ name: 'strategy', type: 'string' },
				{ name: 'value', type: 'string' }
			],
			EIP712Domain: [
				{ name: 'name', type: 'string' },
				{ name: 'version', type: 'string' }
			],
			VotePayload: [
				{ name: 'proposal', type: 'uint256' },
				{ name: 'house', type: 'string' },
				{ name: 'room', type: 'string' },
				{ name: 'note', type: 'string' },
				{ name: 'options', type: 'VotingSystemOption[]' },
				{ name: 'balances', type: 'Balance[]' }
			],
			VotingSystemOption: [{ name: 'value', type: 'string' }]
		}
	};
	return typedData;
};
