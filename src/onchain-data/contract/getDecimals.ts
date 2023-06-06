// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { evmChains } from '../utils/constants';
import { getProvidersForEvmChain } from '../utils/evmChain/apis';
import { erc20Abi } from './abi';
import Web3 from 'web3';

async function queryDecimals(contract: string, provider: any) {
	const web3 = new Web3(provider);
	const erc20 = new web3.eth.Contract(erc20Abi as any, contract);

	const promises = [];
	for (let i = 0; i < 2; i++) {
		const promise = erc20.methods.decimals().call();
		promises.push(promise);
	}

	return Promise.any(promises);
}

async function getDecimals(chain: keyof typeof evmChains, contract: string) {
	const providers = getProvidersForEvmChain(chain);

	const promises = [];
	for (const provider of providers) {
		if (provider) {
			promises.push(queryDecimals(contract, provider));
		}
	}

	return Promise.any(promises);
}

export {
	getDecimals
};