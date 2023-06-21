// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TEvmChains, TChains } from './utils/constants';

type TChainProperties =  {
    [key in TChains[keyof TChains] | TEvmChains[keyof TEvmChains]]: {
        name: key;
        blockTime: number;
        endpoints: string[];
        chainId: number;
        decimals: number;
        symbol: string;
        isEVM: boolean;
    };
}

const chainProperties: TChainProperties = {
	acala: {
		blockTime: 12000,
		chainId: 787,
		decimals: 12,
		endpoints: [
			'wss://acala-rpc.dwellir.com',
			'wss://acala-rpc-0.aca-api.network',
			'wss://acala-rpc-1.aca-api.network',
			'wss://acala-rpc-2.aca-api.network/ws',
			'wss://acala-rpc-3.aca-api.network/ws'
		],
		isEVM: false,
		name: 'acala',
		symbol: 'ACA'
	},
	astar: {
		blockTime: 12000,
		chainId: 592,
		decimals: 18,
		endpoints: [
			'wss://rpc.astar.network',
			'wss://astar.public.blastapi.io',
			'wss://astar-rpc.dwellir.com',
			'wss://astar.api.onfinality.io/public-ws',
			'wss://1rpc.io/astr'
		],
		isEVM: false,
		name: 'astar',
		symbol: 'ASTR'
	},
	kusama: {
		blockTime: 6000,
		chainId: 0,
		decimals: 12,
		endpoints: [
			'wss://kusama.api.onfinality.io/public-ws',
			'wss://kusama-rpc.dwellir.com',
			'wss://kusama-rpc.polkadot.io',
			'wss://rpc.ibp.network/kusama',
			'wss://rpc.dotters.network/kusama'
		],
		isEVM: false,
		name: 'kusama',
		symbol: 'KSM'
	},
	moonbase: {
		blockTime: 12000,
		chainId: 1287,
		decimals: 18,
		endpoints: [
			'wss://moonbase-alpha.public.blastapi.io',
			'wss://wss.api.moonbase.moonbeam.network',
			'wss://moonbeam-alpha.api.onfinality.io/public-ws',
			'wss://moonbase.unitedbloc.com'
		],
		isEVM: true,
		name: 'moonbase',
		symbol: 'DEV'
	},
	moonbeam: {
		blockTime: 12000,
		chainId: 1284,
		decimals: 18,
		endpoints: [
			'wss://moonbeam.public.blastapi.io',
			'wss://moonbeam.api.onfinality.io/public-ws',
			'wss://moonbeam.unitedbloc.com'
		],
		isEVM: true,
		name: 'moonbeam',
		symbol: 'GLMR'
	},
	moonriver: {
		blockTime: 12000,
		chainId: 1285,
		decimals: 18,
		endpoints: [
			'wss://moonriver.public.blastapi.io',
			'wss://moonriver.api.onfinality.io/public-ws',
			'wss://moonriver.unitedbloc.com'
		],
		isEVM: true,
		name: 'moonriver',
		symbol: 'MOVR'
	},
	polkadot: {
		blockTime: 6000,
		chainId: 0,
		decimals: 12,
		endpoints: [
			'wss://polkadot.api.onfinality.io/public-ws',
			'wss://polkadot-rpc.dwellir.com',
			'wss://rpc.polkadot.io',
			'wss://rpc.ibp.network/polkadot',
			'wss://rpc.dotters.network/polkadot'
		],
		isEVM: false,
		name: 'polkadot',
		symbol: 'DOT'
	}
};

export {
	chainProperties
};