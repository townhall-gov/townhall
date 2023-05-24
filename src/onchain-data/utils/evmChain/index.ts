// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { getBlockTimeByHeight } from './query/blockTime';
import { getBlockNumber, getHeightByTime  } from './query/height';
import { evmChains } from '../constants';
import { getBalanceByAddressAndHeight } from './query/balance/getBalanceByAddressAndHeight';

async function getEvmHeight(chain: keyof typeof evmChains, timestamp: number) {
	if (!/^\d+$/.test(`${timestamp}`)) {
		throw new Error('Invalid time');
	}

	const height = await getBlockNumber(chain);
	const time = await getBlockTimeByHeight(chain, height);

	return await getHeightByTime(chain, timestamp, {
		height: parseInt(`${height}`),
		time
	});
}

async function getEvmBalance(chain: keyof typeof evmChains, address: string, blockHashOrHeight: string | number) {
	const balance = await getBalanceByAddressAndHeight(chain, address, blockHashOrHeight);
	return balance.toString();
}

export {
	getEvmHeight,
	getEvmBalance
};