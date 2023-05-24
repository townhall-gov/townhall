// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IStrategy } from '~src/redux/rooms/@types';
import { EVotingStrategy } from '~src/types/enums';
import { IBalanceWithNetwork, IVotesResult } from '~src/types/schema';
import formatTokenAmount from '../formatTokenAmount';
import { BN } from '@polkadot/util';

const getOptionPercentage = (votes_result: IVotesResult, value: string) => {
	const results = votes_result[value];
	if (results && Array.isArray(results) && results.length > 0) {
		const balances =  results.map((result) => {
			return formatTokenAmount(result.amount, result.network);
		});
		const singleOptionTotal = balances.reduce((acc, curr) => {
			return acc + Number(curr);
		}, 0);
		const total =  Object.entries(votes_result).reduce((acc, [, value]) => {
			const balances = value.map((result) => {
				return formatTokenAmount(result.amount, result.network);
			});
			const total = balances.reduce((acc, curr) => {
				return acc + Number(curr);
			}, 0);
			return acc + total;
		}, 0);
		return (singleOptionTotal / total) * 100;
	} else {
		return 0;
	}
};

const getTotalWeight = (strategies: IStrategy[], balances: IBalanceWithNetwork[]) => {
	let total = new BN(0);

	strategies.forEach((strategy) => {
		total = total.add(getStrategyWeight(strategy, balances));
	});

	return total.toString();
};

const getStrategyWeight = (strategy: IStrategy, balances: IBalanceWithNetwork[]) => {
	let total = new BN(0);
	const { name, network } = strategy;
	const balance = balances.find((balance) => balance.network === network);
	if (balance) {
		switch(name){
		case EVotingStrategy.BALANCE_OF:
			total = getBalanceOfStrategyWeight(balance);
		}
	}
	return total;
};

const getBalanceOfStrategyWeight = (balance: IBalanceWithNetwork) => {
	const balanceAmount = formatTokenAmount(balance.balance, balance.network);
	const len = balanceAmount.length;
	const result = new BN(balanceAmount.replace('.', '')).div(new BN(10).pow(new BN(len - 1 - balanceAmount.indexOf('.'))));
	return result;
};

export {
	getStrategyWeight,
	getTotalWeight,
	getOptionPercentage
};