// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { evmChains } from '../../constants';

type TEvmChainEndpointMap = {
	chainId: number;
	chain: keyof typeof evmChains;
	endpoints: string[];
}[];

const evmChainEndpoints: TEvmChainEndpointMap = [
	{
		chain: 'moonbeam',
		chainId: 1284,
		endpoints: [
			'wss://moonbeam.public.blastapi.io',
			'wss://moonbeam.api.onfinality.io/public-ws',
			'wss://moonbeam.unitedbloc.com'
		]
	},
	{
		chain: 'moonriver',
		chainId: 1285,
		endpoints: [
			'wss://moonriver.public.blastapi.io',
			'wss://moonriver.api.onfinality.io/public-ws',
			'wss://moonriver.unitedbloc.com'
		]
	},
	{
		chain: 'moonbase',
		chainId: 1287,
		endpoints: [
			'wss://moonbase-alpha.public.blastapi.io',
			'wss://wss.api.moonbase.moonbeam.network',
			'wss://moonbeam-alpha.api.onfinality.io/public-ws',
			'wss://moonbase.unitedbloc.com'
		]
	},
	{
		chain: 'acala',
		chainId: 787,
		endpoints: [
			'wss://acala-rpc.dwellir.com',
			'wss://acala-rpc-0.aca-api.network',
			'wss://acala-rpc-1.aca-api.network',
			'wss://acala-rpc-2.aca-api.network/ws',
			'wss://acala-rpc-3.aca-api.network/ws'
		]
	},
	{
		chain: 'astar',
		chainId: 592,
		endpoints: [
			'wss://rpc.astar.network',
			'wss://astar.public.blastapi.io',
			'wss://astar-rpc.dwellir.com',
			'wss://astar.api.onfinality.io/public-ws',
			'wss://1rpc.io/astr'
		]
	}
];

const getEvmEndpoints = () => {
	return evmChainEndpoints;
};

export {
	getEvmEndpoints
};
