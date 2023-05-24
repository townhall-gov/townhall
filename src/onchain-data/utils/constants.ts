// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
type TChains = {
	kusama: 'kusama',
	polkadot: 'polkadot'
};
type TEvmChains = {
	moonbeam: 'moonbeam',
	moonriver: 'moonriver',
	moonbase: 'moonbase'
};

const chains: TChains = {
	kusama: 'kusama',
	polkadot: 'polkadot'
};

const evmChains: TEvmChains = {
	moonbase: 'moonbase',
	moonbeam: 'moonbeam',
	moonriver: 'moonriver'
};

const oneSecond = 1000;
const sixSecond = 6 * oneSecond;
const twelveSecond = 12 * oneSecond;

type TChainBlockTimeMap = {
	[k in keyof typeof chains | keyof typeof evmChains]: number
};

const chainBlockTime: TChainBlockTimeMap = {
	[chains.kusama]: sixSecond,
	[chains.polkadot]: sixSecond,
	[evmChains.moonriver]: twelveSecond,
	[evmChains.moonbeam]: twelveSecond,
	[evmChains.moonbase]: twelveSecond
};

const symbols = {
	KSM: 'KSM'
};

export {
	chains,
	evmChains,
	symbols,
	chainBlockTime,
	twelveSecond
};
