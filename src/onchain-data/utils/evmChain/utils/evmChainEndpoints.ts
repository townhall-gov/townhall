// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { evmChains } from '../../constants';

type TEvmChainEndpointMap = {
	chainId: number;
	chain: keyof typeof evmChains;
	endpoints: string[];
	decimals: number;
	symbol: string;
}[];

const evmChainEndpoints: TEvmChainEndpointMap = [
	{
		chain: 'moonbeam',
		chainId: 1284,
		decimals: 18,
		endpoints: [
			'wss://moonbeam.public.blastapi.io',
			'wss://moonbeam.api.onfinality.io/public-ws',
			'wss://moonbeam.unitedbloc.com'
		],
		symbol: 'GLMR'
	},
	{
		chain: 'moonriver',
		chainId: 1285,
		decimals: 18,
		endpoints: [
			'wss://moonriver.public.blastapi.io',
			'wss://moonriver.api.onfinality.io/public-ws',
			'wss://moonriver.unitedbloc.com'
		],
		symbol: 'MOVR'
	},
	{
		chain: 'moonbase',
		chainId: 1287,
		decimals: 18,
		endpoints: [
			'wss://moonbase-alpha.public.blastapi.io',
			'wss://wss.api.moonbase.moonbeam.network',
			'wss://moonbeam-alpha.api.onfinality.io/public-ws',
			'wss://moonbase.unitedbloc.com'
		],
		symbol: 'DEV'
	}
];

const getEvmEndpoints = () => {
	return evmChainEndpoints;
};

export {
	getEvmEndpoints
};
