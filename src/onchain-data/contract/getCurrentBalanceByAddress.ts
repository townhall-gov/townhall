// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockTag, JsonRpcProvider, WebSocketProvider, ethers } from 'ethers';
import { evmChains } from '../utils/constants';
import { getProvidersForEvmChain } from '../utils/evmChain/apis';
import { erc20Abi } from './abi';

async function queryBalanceFromOneProvider(contract: string, provider: WebSocketProvider | JsonRpcProvider, address: string, blockTag?: BlockTag) {
	const erc20 = new ethers.Contract(contract, erc20Abi, provider);

	const promises = [];
	for (let i = 0; i < 2; i++) {
		const promise = erc20.balanceOf(address, { blockTag: blockTag });
		promises.push(promise);
	}

	return Promise.any(promises);
}

async function getCurrentBalanceByAddress(chain: keyof typeof evmChains, contract: string, address: string, blockTag?: BlockTag) {
	const providers = getProvidersForEvmChain(chain);

	const promises = [];
	for (const provider of providers) {
		if (provider) {
			promises.push(queryBalanceFromOneProvider(contract, provider, address, blockTag));
		}
	}

	return Promise.any(promises);
}

export {
	getCurrentBalanceByAddress
};