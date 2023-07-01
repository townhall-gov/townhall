// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { chainProperties } from '~src/onchain-data/networkConstants';
import { TTokenMetadata, getTokensMetadata } from '~src/onchain-data/token-meta/getTokensMetadata';

export interface ITokensMetadataBody {
    network: string;
}
export interface ITokensMetadataQuery {}

const handler: TNextApiHandler<TTokenMetadata[], ITokensMetadataBody, ITokensMetadataQuery> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}
	const { network } = req.body;

	if (!network || !(chainProperties as any)[network]) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE1_NOT_AVAILABLE('Network','Balance') });
	}

	try {
		const result: TTokenMetadata[] = await Promise.race([
			getTokensMetadata(network as keyof typeof chainProperties),
			new Promise<any>((_, reject) =>
				setTimeout(() => reject(new Error('timeout')), 20 * 1000)
			)
		]);
		res.status(StatusCodes.OK).json(result);
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
	}

};

export default withErrorHandling(handler);