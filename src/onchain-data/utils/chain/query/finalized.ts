// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ApiPromise } from '@polkadot/api';
import { extractBlockTime } from './blockTime';

async function getFinalizedHeightTimeFromOneApi(api: ApiPromise) {
	const blockHash = await api.rpc.chain.getFinalizedHead();
	const block = await api.rpc.chain.getBlock(blockHash);

	const height = block.block.header.number.toNumber();
	const time = extractBlockTime(block.block.extrinsics);
	return {
		height,
		time
	};
}

async function getFinalizedHeightFromApis(apis: ApiPromise[]) {
	const promises = [];
	for (const api of apis) {
		promises.push(getFinalizedHeightTimeFromOneApi(api));
	}

	return Promise.any(promises);
}

export {
	getFinalizedHeightFromApis
};
