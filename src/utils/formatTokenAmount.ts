// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BN, formatBalance } from '@polkadot/util';
import Web3 from 'web3';
import { chainProperties } from '~src/onchain-data/networkConstants';

const formatTokenAmount = (amount: string | number, network: string, chain?: any) => {
	if (!chain) {
		chain = chainProperties[network as keyof typeof chainProperties];
	}
	if (!chain) return String(amount);
	const decimals = chain.decimals;
	if (chain.isEVM) {
		const units = Web3.utils.unitMap as any;
		const unit = Object.keys(units).find(key => (units as any)[key] === Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals)).toString());
		const formattedAmount = Web3.utils.fromWei(amount.toString(), unit as any);
		return formattedAmount;
	} else {
		const bnAmount = new BN(amount);
		const formattedAmount = formatBalance(bnAmount, { decimals, withSi: false }).toString();
		return formattedAmount;
	}
};

export const formatToken = (amount: string | number, isEVM: boolean, decimals: number) => {
	if (isEVM) {
		const units = Web3.utils.unitMap as any;
		const unit = Object.keys(units).find(key => (units as any)[key] === Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals)).toString());
		const formattedAmount = Web3.utils.fromWei(amount.toString(), unit as any);
		return formattedAmount;
	} else {
		const bnAmount = new BN(amount);
		const formattedAmount = formatBalance(bnAmount, { decimals, withSi: false }).toString();
		return formattedAmount;
	}
};

export default formatTokenAmount;