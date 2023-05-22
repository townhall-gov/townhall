// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BN, formatBalance } from '@polkadot/util';
import { chainProperties } from './networkConstants';
import * as ethers from 'ethers';

const formatTokenAmount = async (amount: string | number, network: string) => {
	const chain = chainProperties[network];
	if (!chain) {
		throw new Error('Can not format token amount, Invalid network');
	}
	const decimals = chain.tokenDecimals;
	if (chain.isEVM) {
		const ethersAmount = ethers.formatUnits(amount.toString(), decimals);
		return ethersAmount;
	} else {
		const bnAmount = new BN(amount);
		const formattedAmount = formatBalance(bnAmount, { decimals, withSi: false }).toString();
		return formattedAmount;
	}
};

export default formatTokenAmount;