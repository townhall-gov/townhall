// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { getBlockTimeByHeightFromProviders } from './query/blockTime';
import { getBlockNumberFromProviders, getHeightByTimeFromProviders  } from './query/height';
import { evmChains } from '../constants';

async function getEvmHeightFromProviders(providers: any[], chain: keyof typeof evmChains, timestamp: number) {
	if (!/^\d+$/.test(`${timestamp}`)) {
		throw new Error('Invalid time');
	}
	const height = await getBlockNumberFromProviders(providers);
	const time = await getBlockTimeByHeightFromProviders(providers, height);

	const res =  await getHeightByTimeFromProviders(providers, chain, timestamp, {
		height: parseInt(`${height}`),
		time
	});
	return res;
}

export {
	getEvmHeightFromProviders
};