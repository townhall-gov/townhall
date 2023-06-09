// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Web3 from 'web3';

async function getBlockTimeByHeightFromProvider(provider: any, expectedHeight?: any) {
	const web3 = new Web3(provider);
	const block = await web3.eth.getBlock(expectedHeight, false);
	return block? Number(block.timestamp) * 1000: 0;
}

async function getBlockTimeByHeightFromProviders(providers: any[], expectedHeight?: any) {

	const promises = [];
	for (const provider of providers) {
		if (provider) {
			promises.push(getBlockTimeByHeightFromProvider(provider, expectedHeight));
		}
	}

	return Promise.any(promises);
}

export {
	getBlockTimeByHeightFromProviders
};
