// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ApiPromise } from '@polkadot/api';
import { isHex } from '@polkadot/util';

async function getBlockApi(api: ApiPromise, blockHashOrHeight?: string | number) {
	if (!blockHashOrHeight) {
		return api;
	}

	if (isHex(blockHashOrHeight)) {
		return await api.at(blockHashOrHeight);
	} else if (/^\d+$/.test(`${blockHashOrHeight}`)) {
		const hash = await api.rpc.chain.getBlockHash(blockHashOrHeight);
		return await api.at(hash);
	}

	throw 'Invalid block hash or height';
}

async function getBlockHashFromApi(api: ApiPromise, blockHeight: number | string) {
	if (!blockHeight) {
		const hash = await api.rpc.chain.getBlockHash();
		return hash.toString();
	}

	const hash = await api.rpc.chain.getBlockHash(blockHeight);
	return hash.toString();
}

async function getBlockHash(apis: ApiPromise[], blockHashOrHeight: string | number) {
	if (isHex(blockHashOrHeight)) {
		return blockHashOrHeight;
	}

	const promises = [];
	for (const api of apis) {
		promises.push(getBlockHashFromApi(api, blockHashOrHeight));
	}

	return Promise.any(promises);
}

export {
	getBlockApi,
	getBlockHash
};
