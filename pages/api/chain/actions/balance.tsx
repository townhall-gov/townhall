// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import { balance } from '~src/onchain-data';
import { create } from '~src/onchain-data/utils/apis';

export interface IBalanceBody {
    snapshot: {
        address: string;
        network: string;
        height: number | string;
    }[];
}
export interface IBalanceQuery {}
export interface IBalanceConfig {
    network: string;
    height: number | string;
    value: {
        free: number;
        reserved: number;
    };
}
export interface IBalanceResponse {
    balances: IBalanceConfig[];
}

const handler: TNextApiHandler<IBalanceResponse, IBalanceBody, IBalanceQuery> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { snapshot } = req.body;
	create();

	if (!snapshot || !Array.isArray(snapshot) || snapshot.length === 0) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Network, Address, Height is not available, unable to find Balance.' });
	}

	const balancePromises = snapshot.map(async (v) => {
		return balance(v.network, v.address, Number(v.height));
	});

	const balances: IBalanceConfig[] = [];
	try {
		const balancePromiseSettledResults = await Promise.allSettled(balancePromises);
		balancePromiseSettledResults.forEach((balancePromiseSettledResult, i) => {
			if (balancePromiseSettledResult.status === 'fulfilled' && balancePromiseSettledResult.value) {
				balances.push({
					height: snapshot[i].height,
					network: snapshot[i].network,
					value: balancePromiseSettledResult.value
				});
			}
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
	}

	res.status(StatusCodes.OK).json({ balances });
};

export default withErrorHandling(handler);