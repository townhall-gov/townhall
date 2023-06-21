// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ApiPromise } from '@polkadot/api';
import { getBlockApi } from '../../apis/query/block';

async function getBalanceFromOneApi(api: ApiPromise, address: string, blockHashOrHeight?: string |  number): Promise<{
    free: any,
    reserved: any,
}> {
	const blockApi = await getBlockApi(api, blockHashOrHeight);

	if (blockApi.query.system?.account) {
		const account = await blockApi.query.system.account(address);
		const data = (account.toHuman() as any)?.data;
		Object.keys(data).forEach((key) => {
			data[key] = String(data[key]).replace(/,/g, '');
		});
		return data;
	}

	if (blockApi.query.balances) {
		const free = await blockApi.query.balances.freeBalance(address);
		const reserved = await blockApi.query.balances.reservedBalance(address);
		return {
			free: free.toHuman(),
			reserved: reserved.toHuman()
		};
	}

	return {
		free: 0,
		reserved: 0
	};
}

async function getFinalizedBalanceFromApis(apis: ApiPromise[], address: string, blockHashOrHeight?: string | number) {
	const promises: Promise<{
        free: any,
        reserved: any,
      }>[] = [];
	for (const api of apis) {
		promises.push(getBalanceFromOneApi(api, address, blockHashOrHeight));
	}

	return Promise.any(promises);
}

export {
	getFinalizedBalanceFromApis
};