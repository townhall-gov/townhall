// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { getBalance, getHeight } from './utils/chain';
import { chains, evmChains } from './utils/constants';
import { getEvmBalance, getEvmHeight } from './utils/evmChain';

const height = async (chain: string, time: number | string) => {
	let heightTime = {
		height: 0,
		time: 0
	};
	if (Object.keys(chains).includes(chain) === false && Object.keys(evmChains).includes(chain) === false) {
		return heightTime;
	}
	if (Object.keys(evmChains).includes(chain)) {
		heightTime = await getEvmHeight(chain as keyof typeof evmChains, Number(time));
	} else {
		heightTime = await getHeight(chain as keyof typeof chains, Number(time));
	}
	return heightTime;
};

const balance = async (chain: string, address: string, height: number) => {
	let balance = {
		free: 0,
		reserved: 0
	};
	if (Object.keys(chains).includes(chain) === false && Object.keys(evmChains).includes(chain) === false) {
		return balance;
	}

	if (Object.keys(evmChains).includes(chain)) {
		const evmBalance = await getEvmBalance(chain as keyof typeof evmChains, String(address), Number(height));
		balance.free = evmBalance as any;
	} else {
		balance = await getBalance(chain as keyof typeof chains, String(address), Number(height));
	}
	return balance;
};

export {
	height,
	balance
};