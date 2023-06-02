// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { JsonRpcProvider, WebSocketProvider, ethers } from 'ethers';
import { evmChains } from '../utils/constants';
import { getProvidersForEvmChain } from '../utils/evmChain/apis';
import { erc20Abi } from './abi';

async function querySymbol(contract: string, provider: WebSocketProvider | JsonRpcProvider) {
	const erc20 = new ethers.Contract(contract, erc20Abi, provider);

	const promises = [];
	for (let i = 0; i < 2; i++) {
		const promise = erc20.symbol();
		promises.push(promise);
	}

	return Promise.any(promises);
}

async function getSymbol(chain: keyof typeof evmChains, contract: string) {
	const providers = getProvidersForEvmChain(chain);

	const promises = [];
	for (const provider of providers) {
		if (provider) {
			promises.push(querySymbol(contract, provider));
		}
	}

	return Promise.any(promises);
}

export {
	getSymbol
};