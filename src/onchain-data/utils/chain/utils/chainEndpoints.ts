// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { chains } from '../../constants';

type TChainEndpointsMap = {
	chain: keyof typeof chains;
	endpoints: string[];
	chainId: number;
	decimals: number;
	symbol: string;
}[];

const chainEndpoints: TChainEndpointsMap = [
	{
		chain: 'kusama',
		chainId: 0,
		decimals: 12,
		endpoints: [
			'wss://kusama.api.onfinality.io/public-ws',
			'wss://kusama-rpc.dwellir.com',
			'wss://kusama-rpc.polkadot.io',
			'wss://rpc.ibp.network/kusama',
			'wss://rpc.dotters.network/kusama'
		],
		symbol: 'KSM'
	},
	{
		chain: 'polkadot',
		chainId: 0,
		decimals: 12,
		endpoints: [
			'wss://polkadot.api.onfinality.io/public-ws',
			'wss://polkadot-rpc.dwellir.com',
			'wss://rpc.polkadot.io',
			'wss://rpc.ibp.network/polkadot',
			'wss://rpc.dotters.network/polkadot'
		],
		symbol: 'DOT'
	},
	{
		chain: 'acala',
		chainId: 787,
		decimals: 12,
		endpoints: [
			'wss://acala-rpc.dwellir.com',
			'wss://acala-rpc-0.aca-api.network',
			'wss://acala-rpc-1.aca-api.network',
			'wss://acala-rpc-2.aca-api.network/ws',
			'wss://acala-rpc-3.aca-api.network/ws'
		],
		symbol: 'ACA'
	},
	{
		chain: 'astar',
		chainId: 592,
		decimals: 12,
		endpoints: [
			'wss://rpc.astar.network',
			'wss://astar.public.blastapi.io',
			'wss://astar-rpc.dwellir.com',
			'wss://astar.api.onfinality.io/public-ws',
			'wss://1rpc.io/astr'
		],
		symbol: 'ASTR'
	}
];

const getEndpoints = () => {
	return chainEndpoints;
};

export {
	getEndpoints
};
