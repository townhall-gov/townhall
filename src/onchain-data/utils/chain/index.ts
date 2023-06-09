// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { chains } from '../constants';
import { createAndGetApis, getApis } from './apis';
import { getFinalizedBalanceFromApis } from './query/balance/finalized';
import { getFinalizedHeightFromApis } from './query/finalized';
import { getHeightByTime } from './query/queryHeight';

async function getHeight(chain: keyof typeof chains, time: number) {

	const apis = await getApis(chain);
	if (apis.every((api) => !api.isConnected)) {
		throw new Error('No apis connected');
	}

	const finalizedHeightTime = await getFinalizedHeightFromApis(apis);
	if (!(time)) {
		return finalizedHeightTime;
	}

	return await getHeightByTime(chain, apis, time, finalizedHeightTime);
}

async function getBalance(chain: keyof typeof chains, address: string, blockHashOrHeight?: string | number) {
	const apis = await createAndGetApis(chain);
	if (!apis || !apis.length || apis.every((api) => !api.isConnected)) {
		throw new Error('No apis connected');
	}
	try {
		const res =  await getFinalizedBalanceFromApis(apis, address, blockHashOrHeight);
		apis.forEach((api) => api.disconnect());
		return res;
	} catch (error) {
		apis.forEach((api) => api.disconnect());
		return {
			free: 0,
			reserved: 0
		} as {
			free: any;
			reserved: any
		};
	}
}

export {
	getHeight,
	getBalance
};