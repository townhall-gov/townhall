// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export const network = {
	KUSAMA: 'kusama',
	MOONBASE: 'moonbase',
	MOONBEAM: 'moonbeam',
	MOONRIVER: 'moonriver',
	POLKADOT: 'polkadot'
};

export const tokenSymbol = {
	KUSAMA: 'KSM',
	MOONBASE: 'DEV',
	MOONBEAM: 'GLMR',
	MOONRIVER: 'MOVR',
	POLKADOT: 'DOT'
};

export type TokenSymbol = typeof tokenSymbol[keyof typeof tokenSymbol];

export type ChainPropType = {
  [index: string]: ChainProps;
};

export interface ChainProps {
  'blockTime': number;
  'ss58Format': number;
  'tokenDecimals': number;
  'tokenSymbol': TokenSymbol;
  'chainId': number;
  'isEVM': boolean;
}

export const chainProperties: ChainPropType = {
	[network.KUSAMA]: {
		blockTime: 6000,
		chainId: 0,
		isEVM: false,
		ss58Format: 2,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.KUSAMA
	},
	[network.MOONBASE]: {
		blockTime: 12000,
		chainId: 1287,
		isEVM: true,
		ss58Format: 0,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.MOONBASE
	},
	[network.MOONBEAM]: {
		blockTime: 12000,
		chainId: 1284,
		isEVM: true,
		ss58Format: 1284,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.MOONBEAM
	},
	[network.MOONRIVER]: {
		blockTime: 12000,
		chainId: 1285,
		isEVM: true,
		ss58Format: 1285,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.MOONRIVER
	},
	[network.POLKADOT]: {
		blockTime: 6000,
		chainId: 0,
		isEVM: false,
		ss58Format: 0,
		tokenDecimals: 10,
		tokenSymbol: tokenSymbol.POLKADOT
	}
};