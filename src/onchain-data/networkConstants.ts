// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type TAssetChains = {
	acala: 'acala';
	astar: 'astar';
	bifrost: 'bifrost';
	karura: 'karura';
	moonbase: 'moonbase';
	moonbeam: 'moonbeam';
	moonriver: 'moonriver';
	statemine: 'statemine';
};

export const assetChains = {
	acala: 'acala',
	astar: 'astar',
	bifrost: 'bifrost',
	karura: 'karura',
	moonbase: 'moonbase',
	moonbeam: 'moonbeam',
	moonriver: 'moonriver',
	statemine: 'statemine'
};

export type TChains = {
	kusama: 'kusama';
	polkadot: 'polkadot';
};

export const chains = {
	kusama: 'kusama',
	polkadot: 'polkadot'
};

export type TEvmChains = {
	moonbeam: 'moonbeam';
	moonriver: 'moonriver';
	moonbase: 'moonbase';
};

export const evmChains = {
	moonbase: 'moonbase',
	moonbeam: 'moonbeam',
	moonriver: 'moonriver'
};

export type TAssetType = {
	Native: 'Native';
	Contract: 'Contract';
	Assets: 'Assets';
}

export const assetType = {
	Assets: 'Assets',
	Contract: 'Contract',
	Native: 'Native'
} as const;

export type TChainProperty = {
	blockTime: number;
	endpoints: string[];
	chainId: number;
	decimals: number;
	symbol: string;
	isEVM: boolean;
};

export type TChainProperties =  {
    [key in
		| TChains[keyof TChains]
		| TEvmChains[keyof TEvmChains]
		| TAssetChains[keyof TAssetChains]]: TChainProperty & {
			name: key;
		} & (key extends TEvmChains[keyof TEvmChains]
			? {
				assets: [TAssetType['Native'], TAssetType['Assets'], TAssetType['Contract']];
			}
			: key extends TAssetChains[keyof TAssetChains]
			? {
				assets: [TAssetType['Native'], TAssetType['Assets']];
			}
			: {}
		);
}

const chainProperties: TChainProperties = {
	acala: {
		assets: [assetType.Native, assetType.Assets],
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
		assets: [assetType.Native, assetType.Assets],
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
	bifrost: {
		assets: [assetType.Native, assetType.Assets],
		blockTime: 12000,
		chainId: 0,
		decimals: 12,
		endpoints: [
			'wss://bifrost-parachain.api.onfinality.io/public-ws',
			'wss://bifrost-rpc.liebi.com/ws',
			'wss://bifrost-rpc.dwellir.com'
		],
		isEVM: false,
		name: 'bifrost',
		symbol: 'BNC'
	},
	karura: {
		assets: [assetType.Native, assetType.Assets],
		blockTime: 12000,
		chainId: 0,
		decimals: 12,
		endpoints: [
			'wss://karura.api.onfinality.io/public-ws',
			'wss://karura-rpc.dwellir.com',
			'wss://karura-rpc-3.aca-api.network/ws',
			'wss://karura-rpc-2.aca-api.network/ws',
			'wss://karura-rpc-1.aca-api.network/ws',
			'wss://karura-rpc-0.aca-api.network/ws'
		],
		isEVM: false,
		name: 'karura',
		symbol: 'KAR'
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
		assets: [assetType.Native, assetType.Assets, assetType.Contract],
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
		assets: [assetType.Native, assetType.Assets, assetType.Contract],
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
		assets: [assetType.Native, assetType.Assets, assetType.Contract],
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
		decimals: 10,
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
	},
	statemine: {
		assets: [assetType.Native, assetType.Assets],
		blockTime: 12000,
		chainId: 0,
		decimals: 12,
		endpoints: [
			'wss://statemine.public.curie.radiumblock.co/ws',
			'wss://statemine.api.onfinality.io/public-ws'
		],
		isEVM: false,
		name: 'statemine',
		symbol: 'KSM'
	}
};

export {
	chainProperties
};