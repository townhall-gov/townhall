// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import { getDecimals } from '~src/onchain-data/contract/getDecimals';
import { getName } from '~src/onchain-data/contract/getName';
import { getSymbol } from '~src/onchain-data/contract/getSymbol';
import { chainProperties, evmChains } from '~src/onchain-data/networkConstants';
import { create } from '~src/onchain-data/utils/apis';

export interface IContractInfoInfoBody {
    contract_address: string;
    network: string;
}
export interface IContractInfoInfoQuery {}
export interface IContractInfoInfoResponse {
    name: string;
    symbol: string;
    decimals: number;
}

const handler: TNextApiHandler<IContractInfoInfoResponse, IContractInfoInfoBody, IContractInfoInfoQuery> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { contract_address, network } = req.body;
	create();

	if (!contract_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Contract address is not available, unable to find Contract Info.' });
	}

	if (!network || !(chainProperties as any)[network]) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Network is not available, unable to find Contract Info.' });
	}

	let name = '';
	let symbol = '';
	let decimals = 0;
	try {
		const res = await Promise.race([
			Promise.allSettled([
				getName(network as keyof typeof evmChains, contract_address),
				getSymbol(network as keyof typeof evmChains, contract_address),
				getDecimals(network as keyof typeof evmChains, contract_address)
			]),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('timeout')), 20 * 1000)
			)
		]);
		if (res && Array.isArray(res) && res.length === 3) {
			res.forEach((v, i) => {
				if (v.status === 'fulfilled') {
					if (i === 0) {
						name = (v.value || '').toString();
					} else if (i === 1) {
						symbol = (v.value || '').toString();
					} else if (i === 2) {
						decimals = Number(v.value || '');
					}
				}
			});
		}
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
	}

	res.status(StatusCodes.OK).json({ decimals, name, symbol });
};

export default withErrorHandling(handler);