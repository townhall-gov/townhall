// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EVotingStrategy } from '~src/types/enums';
import BigNumber from 'bignumber.js';
import { IStrategyWithHeightAndBalance } from 'pages/api/chain/actions/balance';

const calculateStrategy = (strategy: IStrategyWithHeightAndBalance) => {
	let total = new BigNumber(0);
	const { name, value } = strategy;
	const decimals = strategy.token_metadata[strategy.asset_type]?.decimals || null;
	if (value) {
		switch(name){
		case EVotingStrategy.BALANCE_OF:
			total = calculateBalanceOfStrategy(value);
			break;
		case EVotingStrategy.QUADRATIC_BALANCE_OF:
			total = calculateQuadraticBalanceOfStrategy(decimals, value);
		}
	}
	return total;
};

const calculateBalanceOfStrategy = (value: string) => {
	return new BigNumber(value);
};

const calculateQuadraticBalanceOfStrategy = (decimals: number | null, value: string) => {
	const val = new BigNumber(value);
	if (!decimals) return val;
	let num = val.div(Math.pow(10, decimals));
	num = num.sqrt();
	return num.times(Math.pow(10, decimals));
};

export {
	calculateStrategy
};