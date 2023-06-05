// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import { getCurrentBalanceByAddress } from '~src/onchain-data/contract/getCurrentBalanceByAddress';
import { getDecimals } from '~src/onchain-data/contract/getDecimals';
import { getSymbol } from '~src/onchain-data/contract/getSymbol';
import { create } from '~src/onchain-data/utils/apis';
import { evmChains } from '~src/onchain-data/utils/constants';

export interface ICurrentBalanceBody {
    contract: string;
    address: string;
    network: string;
}
export interface ICurrentBalanceQuery {}
export interface ICurrentBalanceResponse {
    balance: string;
    symbol: string;
    decimals: string;
}

const handler: TNextApiHandler<ICurrentBalanceResponse, ICurrentBalanceBody, ICurrentBalanceQuery> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { contract, address, network } = req.body;
	create();

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'User address is not available, unable to find Balance.' });
	}

	if (!contract) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Contract is not available, unable to find Balance.' });
	}

	if (!network) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Network is not available, unable to find Balance.' });
	}

	let balance = '';
	let symbol = '';
	let decimals = '';
	try {
		const res = await Promise.race([
			Promise.allSettled([
				getCurrentBalanceByAddress(network as keyof typeof evmChains, contract, address),
				getSymbol(network as keyof typeof evmChains, contract),
				getDecimals(network as keyof typeof evmChains, contract)
			]),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('timeout')), 20 * 1000)
			)
		]);
		if (res && Array.isArray(res) && res.length === 3) {
			res.forEach((v, i) => {
				if (v.status === 'fulfilled') {
					if (i === 0) {
						balance = (v.value || '').toString();
					} else if (i === 1) {
						symbol = (v.value || '').toString();
					} else if (i === 2) {
						decimals = (v.value || '').toString();
					}
				}
			});
		}
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
	}

	res.status(StatusCodes.OK).json({ balance, decimals, symbol });
};

export default withErrorHandling(handler);