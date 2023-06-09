// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { evmChains } from '../networkConstants';
import { createAndGetProviders } from '../utils/evmChain/apis';
import { queryBalanceFromOneProvider } from '../utils/evmChain/query/balance/getBalanceByAddressAndHeight';
import { erc20Abi } from './abi';
import Web3 from 'web3';

async function queryBalanceUsingContractAddressFromOneProvider(contract: string, provider: any, address: string, blockNumber?: number) {
	const web3 = new Web3(provider);
	const erc20 = new web3.eth.Contract(erc20Abi as any, contract);

	const promises = [];
	for (let i = 0; i < 2; i++) {
		const promise = erc20.methods.balanceOf(address).call(undefined, blockNumber);
		promises.push(promise);
	}

	return Promise.any(promises);
}

async function getCurrentBalanceUsingContractAddress(chain: keyof typeof evmChains, contract: string, address: string, blockNumber?: number) {
	const providers = await createAndGetProviders(chain);

	const promises = [];
	for (const provider of providers) {
		if (provider) {
			promises.push(queryBalanceUsingContractAddressFromOneProvider(contract, provider, address, blockNumber));
		}
	}

	const res = Promise.any(promises);
	providers.forEach((provider) => provider.disconnect());
	return res;
}

async function getCurrentBalanceByAddress(chain: keyof typeof evmChains, address: string, blockNumber?: number) {
	const providers = await createAndGetProviders(chain);

	const promises = [];
	for (const provider of providers) {
		if (provider) {
			promises.push(queryBalanceFromOneProvider(provider, address, blockNumber));
		}
	}

	const res = Promise.any(promises);
	providers.forEach((provider) => provider.disconnect());
	return res;
}

export {
	queryBalanceUsingContractAddressFromOneProvider,
	getCurrentBalanceByAddress,
	getCurrentBalanceUsingContractAddress
};