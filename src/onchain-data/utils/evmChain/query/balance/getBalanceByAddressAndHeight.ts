// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Web3 from 'web3';

async function queryBalanceFromOneProvider(provider: any, address: string, blockTag?: number | string) {
	const promises = [];
	for (let i = 0; i < 2; i++) {
		const web3 = new Web3(provider);
		const promise = web3.eth.getBalance(address, blockTag as any);
		promises.push(promise);
	}

	return Promise.any(promises);
}

export {
	queryBalanceFromOneProvider
};