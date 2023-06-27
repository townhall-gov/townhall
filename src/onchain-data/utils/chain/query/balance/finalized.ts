// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ApiPromise } from '@polkadot/api';
import { getBlockApi } from '../../apis/query/block';
import BigNumber from 'bignumber.js';

async function getBalanceFromOneApi(api: ApiPromise, address: string, blockHashOrHeight?: string |  number): Promise<{
    free: any,
    reserved: any,
}> {
	const blockApi = await getBlockApi(api, blockHashOrHeight);

	if (blockApi.query.system?.account) {
		const account = await blockApi.query.system.account(address);
		const data = (account.toHuman() as any)?.data;
		Object.keys(data).forEach((key) => {
			data[key] = String(data[key] || '').replace(/,/g, '');
		});
		return data;
	}

	if (blockApi.query.balances) {
		const free = await blockApi.query.balances.freeBalance(address);
		const reserved = await blockApi.query.balances.reservedBalance(address);
		return {
			free: String(free.toHuman() || '').replace(/,/g, ''),
			reserved: String(reserved.toHuman() || '').replace(/,/g, '')
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

async function queryBalanceFromOneApi(api: ApiPromise, address: string, blockHashOrHeight?: string |  number): Promise<string> {
	const blockApi = await getBlockApi(api, blockHashOrHeight);

	if (blockApi.query.system?.account) {
		const account = await blockApi.query.system.account(address);
		const data = (account.toHuman() as any)?.data;
		let result = new BigNumber(0);
		if (data.free) {
			result = result.plus(String(data.free || '').replace(/,/g, ''));
		}
		if (data.reserved) {
			result = result.plus(String(data.reserved || '').replace(/,/g, ''));
		}
		return result.toString();
	}

	if (blockApi.query.balances) {
		const free = await blockApi.query.balances.freeBalance(address);
		const reserved = await blockApi.query.balances.reservedBalance(address);
		return new BigNumber(String(free.toHuman() || '').replace(/,/g, '')).plus( String(reserved.toHuman() || '').replace(/,/g, '')).toString();
	}

	return '0';
}

async function queryBalanceUsingAssetsAccountFromOneApi(api: ApiPromise, address: string, assetId: string, blockHashOrHeight?: string |  number): Promise<string> {
	const blockApi = await getBlockApi(api, blockHashOrHeight);

	if (!api.query.assets?.account) {
		throw new Error(`${api} does not support assets balance query`);
	}

	const account = await blockApi.query.assets.account(assetId, address);
	if (!(account as any).isSome) {
		return '0';
	}
	return (account as any).value?.balance.toString();
}

async function queryBalanceUsingTokensAccountsFromOneApi(api: ApiPromise, address: string, assetId: any, blockHashOrHeight?: string |  number) {
	const blockApi = await getBlockApi(api, blockHashOrHeight);

	if (!api.query?.tokens?.accounts) {
		throw new Error(`${api} does not support tokens balance query`);
	}

	const account = await blockApi.query.tokens.accounts(address, assetId);
	if (!account.isEmpty) {
		return '0';
	}
	const data = account.toHuman() as any;
	let result = new BigNumber(0);
	if (data.free) {
		result = result.plus(String(data.free || '').replace(/,/g, ''));
	}
	if (data.reserved) {
		result = result.plus(String(data.reserved || '').replace(/,/g, ''));
	}
	return result.toString();
}

export {
	getFinalizedBalanceFromApis,
	queryBalanceFromOneApi,
	queryBalanceUsingAssetsAccountFromOneApi,
	queryBalanceUsingTokensAccountsFromOneApi
};