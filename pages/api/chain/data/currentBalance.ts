// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { getCurrentBalanceByAddress } from '~src/onchain-data/contract/getCurrentBalanceByAddress';
import { chainProperties } from '~src/onchain-data/networkConstants';
import { getBalance } from '~src/onchain-data/utils/chain';
import { chains, evmChains } from '~src/onchain-data/utils/constants';

export interface ICurrentBalanceBody {
    address: string;
    network: string;
}
export interface ICurrentBalanceQuery {}
export interface ICurrentBalanceResponse {
    balance: string;
}

const handler: TNextApiHandler<ICurrentBalanceResponse, ICurrentBalanceBody, ICurrentBalanceQuery> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}
	const { address, network } = req.body;

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE1_NOT_AVAILABLE('User address','Balance') });
	}

	if (!network || !(chainProperties as any)[network]) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE1_NOT_AVAILABLE('Network','Balance') });
	}

	let balance = '';
	try {
		const chain = (chainProperties)[network as keyof typeof chainProperties];
		if (!chain?.isEVM) {
			const res: any = await Promise.race([
				getBalance(network as keyof typeof chains, address),
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error('timeout')), 20 * 1000)
				)
			]);
			if (res && res.free) {
				balance = res.free;
			}
		} else {
			const res: any = await Promise.race([
				getCurrentBalanceByAddress(network as keyof typeof evmChains, address),
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error('timeout')), 20 * 1000)
				)
			]);
			balance = res.value;
		}
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
	}

	res.status(StatusCodes.OK).json({ balance });
};

export default withErrorHandling(handler);