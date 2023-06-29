// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IStrategyWithHeight } from '~src/types/schema';
import { assetType, evmChains } from './networkConstants';
import { getEvmHeightFromProviders } from './utils/evmChain';
import { createAndGetApis } from './utils/chain/apis';
import { createAndGetProviders } from './utils/evmChain/apis';
import { queryBalanceFromOneProvider } from './utils/evmChain/query/balance/getBalanceByAddressAndHeight';
import { queryBalanceFromOneApi, queryBalanceUsingAssetsAccountFromOneApi, queryBalanceUsingORMLTokensAccountsFromOneApi, queryBalanceUsingTokensAccountsFromOneApi } from './utils/chain/query/balance/finalized';
import { IStrategy } from '~src/redux/rooms/@types';
import { getFinalizedHeightFromApis } from './utils/chain/query/finalized';
import { getHeightByTime } from './utils/chain/query/queryHeight';
import { queryBalanceUsingContractAddressFromOneProvider } from './contract/getCurrentBalanceByAddress';
import Web3 from 'web3';

const getHeightUsingStrategy = async (strategy: IStrategy, time: number | string) => {
	const heightTime = {
		height: 0,
		time: 0
	};
	if (strategy) {
		if (evmChains[strategy.network as keyof typeof evmChains]) {
			const providers = await createAndGetProviders(strategy.network as keyof typeof evmChains);

			try {
				const res = await getEvmHeightFromProviders(providers, strategy.network as keyof typeof evmChains, Number(time));
				providers.forEach((provider) => provider.disconnect());
				return res;
			} catch (error) {
				providers.forEach((provider) => provider.disconnect());
			}
		} else {
			const apis = await createAndGetApis(strategy.network);
			if (!apis || !apis.length || apis.every((api) => !api.isConnected)) {
				throw new Error('No apis connected');
			}
			try {
				const finalizedHeightTime = await getFinalizedHeightFromApis(apis);
				if (!(time)) {
					apis.forEach((api) => api.disconnect());
					return finalizedHeightTime;
				}
				const res =  await getHeightByTime(strategy.network, apis, Number(time), finalizedHeightTime);
				apis.forEach((api) => api.disconnect());
				return res;
			} catch (error) {
				apis.forEach((api) => api.disconnect());
			}
		}
	}
	return heightTime;
};

const getBalanceUsingStrategyWithHeight = async (strategy_with_height: IStrategyWithHeight, address: string) => {
	if (!strategy_with_height) {
		return '0';
	}
	const web3 = new Web3();
	if (evmChains[strategy_with_height.network as keyof typeof evmChains]) {
		if (!web3.utils.isAddress(address)) {
			return '0';
		}
		const providers = await createAndGetProviders(strategy_with_height.network as keyof typeof evmChains);
		const promises = [];
		if (strategy_with_height.asset_type === assetType.Native) {
			for (const provider of providers) {
				promises.push(queryBalanceFromOneProvider(provider, address, strategy_with_height.height));
			}
		} else if (strategy_with_height.asset_type === assetType.Contract) {
			const token_metadata = strategy_with_height.token_metadata[strategy_with_height.asset_type];
			for (const provider of providers) {
				promises.push(queryBalanceUsingContractAddressFromOneProvider(token_metadata?.contract_address || '', provider, address, strategy_with_height.height));
			}
		} else {
			return '0';
		}
		const res = await Promise.any(promises);
		providers.forEach((provider) => provider.disconnect());
		return res;
	} else {
		if (web3.utils.isAddress(address)) {
			return '0';
		}
		const apis = await createAndGetApis(strategy_with_height.network);
		if (!apis || !apis.length || apis.every((api) => !api.isConnected)) {
			throw new Error('No apis connected');
		}
		const promises = [];
		if (strategy_with_height.asset_type === assetType.Native) {
			for (const api of apis) {
				promises.push(queryBalanceFromOneApi(api, address, strategy_with_height.height));
			}
		} else if (strategy_with_height.asset_type === assetType.Assets) {
			const token_metadata = strategy_with_height.token_metadata[strategy_with_height.asset_type];
			for (const api of apis) {
				if (['statemine', 'moonriver', 'moonbeam', 'moonbase', 'astar'].includes(strategy_with_height.network)) {
					promises.push(queryBalanceUsingAssetsAccountFromOneApi(api, address, token_metadata?.tokenId as string, strategy_with_height.height));
				} else if (['karura', 'acala', 'bifrost'].includes(strategy_with_height.network)) {
					promises.push(queryBalanceUsingTokensAccountsFromOneApi(api, address, token_metadata?.tokenId, strategy_with_height.height));
				} else if (['centrifuge'].includes(strategy_with_height.network)) {
					promises.push(queryBalanceUsingORMLTokensAccountsFromOneApi(api, address, token_metadata?.tokenId, strategy_with_height.height));
				}
			}
		}
		try {
			const res = await Promise.any(promises) || 0;
			apis.forEach((api) => api.disconnect());
			return res;
		} catch (error) {
			apis.forEach((api) => api.disconnect());
			return '0';
		}
	}
};

export {
	getBalanceUsingStrategyWithHeight,
	getHeightUsingStrategy
};