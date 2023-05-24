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
			'https://1rpc.io/glmr',
			'https://moonbeam.public.blastapi.io',
			'https://moonbeam.api.onfinality.io/public',
			'https://moonbeam-mainnet.gateway.pokt.network/v1/lb/629a2b5650ec8c0039bb30f0',
			'https://moonbeam.unitedbloc.com',
			'wss://moonbeam.public.blastapi.io',
			'wss://moonbeam.api.onfinality.io/public-ws',
			'wss://moonbeam.unitedbloc.com'
		]
	},
	{
		chain: 'moonriver',
		chainId: 1285,
		endpoints: [
			'https://moonriver.public.blastapi.io',
			'https://moonriver.api.onfinality.io/public',
			'https://moonriver-mainnet.gateway.pokt.network/v1/lb/62a74fdb123e6f003963642f',
			'https://moonriver.unitedbloc.com',
			'wss://moonriver.public.blastapi.io',
			'wss://moonriver.api.onfinality.io/public-ws',
			'wss://moonriver.unitedbloc.com'
		]
	},
	{
		chain: 'moonbase',
		chainId: 1287,
		endpoints: [
			'https://moonbase-alpha.public.blastapi.io',
			'https://rpc.api.moonbase.moonbeam.network',
			'https://moonbeam-alpha.api.onfinality.io/public',
			'https://moonbase.unitedbloc.com',
			'wss://moonbase-alpha.public.blastapi.io',
			'wss://wss.api.moonbase.moonbeam.network',
			'wss://moonbeam-alpha.api.onfinality.io/public-ws',
			'wss://moonbase.unitedbloc.com'
		]
	}
];

const getEvmEndpoints = () => {
	return evmChainEndpoints;
};

export {
	getEvmEndpoints
};
