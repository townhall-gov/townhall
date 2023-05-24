// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IStrategy } from '~src/redux/rooms/@types';
import { EVotingStrategy } from '~src/types/enums';
import { IBalanceWithNetwork } from '~src/types/schema';
import formatTokenAmount from '../formatTokenAmount';
import { BN } from '@polkadot/util';

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
	getStrategyWeight
};