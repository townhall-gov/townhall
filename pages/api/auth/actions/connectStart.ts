// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';

export interface IConnectWalletStartBody {
    address: string;
}

export interface IConnectWalletStartResponse {
    signMessage: string;
}

const handler: TNextApiHandler<IConnectWalletStartResponse, IConnectWalletStartBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { address } = req.body;

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid address.' });
	}

	const signMessage = await authServiceInstance.ConnectWalletStart(address);

	res.status(StatusCodes.OK).json({ signMessage });
};

export default withErrorHandling(handler);