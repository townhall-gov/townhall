// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import { chainProperties } from '~src/onchain-data/networkConstants';
import { getNativeTokenInfo } from '~src/onchain-data/token-meta/getNativeTokenInfo';
import { create } from '~src/onchain-data/utils/apis';

export interface ITokenInfoBody {
    network: string;
}
export interface ITokenInfoQuery {}
export interface ITokenInfoResponse {
    decimals: string;
    ss58Format: string;
    symbol: string;
}

const handler: TNextApiHandler<ITokenInfoResponse, ITokenInfoBody, ITokenInfoQuery> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { network } = req.body;
	create();

	if (!network || !(chainProperties as any)[network]) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Network is not available, unable to find Balance.' });
	}

	try {
		const result: any = await Promise.race([
			getNativeTokenInfo(network as keyof typeof chainProperties),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('timeout')), 20 * 1000)
			)
		]);
		res.status(StatusCodes.OK).json(result);
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
	}

};

export default withErrorHandling(handler);