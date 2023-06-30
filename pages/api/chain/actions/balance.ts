// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { getBalanceUsingStrategyWithHeight } from '~src/onchain-data';
import { IStrategyWithHeight } from '~src/types/schema';

export interface IBalanceBody {
	address: string;
    voting_strategies_with_height: IStrategyWithHeight[];
}
export interface IBalanceQuery {}
export interface IStrategyWithHeightAndBalance extends IStrategyWithHeight {
    value: string;
}
export interface IBalanceResponse {
    balances: IStrategyWithHeightAndBalance[];
}

const handler: TNextApiHandler<IBalanceResponse, IBalanceBody, IBalanceQuery> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_POST_REQUEST });
	}
	const { voting_strategies_with_height, address } = req.body;

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Voter Address is not available, unable to find Balance.' });
	}

	if (!voting_strategies_with_height || !Array.isArray(voting_strategies_with_height) || voting_strategies_with_height.length === 0) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Network, Address, Height is not available, unable to find Balance.' });
	}

	const balancePromises = voting_strategies_with_height.map(async (v) => {
		return getBalanceUsingStrategyWithHeight(v, address);
	});

	const balances: IStrategyWithHeightAndBalance[] = [];
	try {
		const balancePromiseSettledResults = await Promise.allSettled(balancePromises);
		balancePromiseSettledResults.forEach((balancePromiseSettledResult, i) => {
			if (balancePromiseSettledResult.status === 'fulfilled' && balancePromiseSettledResult.value) {
				balances.push({
					...voting_strategies_with_height[i],
					value: balancePromiseSettledResult.value
				});
			} else {
				console.log('Error in getting balance:-', balancePromiseSettledResult, voting_strategies_with_height[i]);
			}
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
	}

	res.status(StatusCodes.OK).json({ balances });
};

export default withErrorHandling(handler);