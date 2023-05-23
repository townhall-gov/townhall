// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { JsonRpcProvider, WebSocketProvider } from 'ethers';
import { evmChains } from '../../../constants';
import { getProvidersForEvmChain } from '../../apis';

async function queryBalanceFromOneProvider(provider: WebSocketProvider | JsonRpcProvider, address: string, blockTag?: number | string) {
	const promises = [];
	for (let i = 0; i < 2; i++) {
		const promise = provider.getBalance(address, blockTag);
		promises.push(promise);
	}

	return Promise.any(promises);
}

async function getBalanceByAddressAndHeight(chain: keyof typeof evmChains, address: string, height: number | string) {
	const providers = getProvidersForEvmChain(chain);

	const promises = [];
	for (const provider of providers) {
		if (provider) {
			promises.push(queryBalanceFromOneProvider(provider, address, height));
		}
	}

	return Promise.any(promises);
}

export {
	getBalanceByAddressAndHeight
};