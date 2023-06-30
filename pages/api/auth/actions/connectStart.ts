// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import messages from '~src/auth/utils/messages';
import { EWallet } from '~src/types/enums';

export interface IConnectWalletStartBody {
    address: string;
	wallet: EWallet;
}

export interface IConnectWalletStartResponse {
    signMessage: string;
}

const handler: TNextApiHandler<IConnectWalletStartResponse, IConnectWalletStartBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_POST_REQUEST });
	}
	const { address, wallet } = req.body;

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ADDRESS });
	}

	const signMessage = await authServiceInstance.ConnectWalletStart(address, wallet);

	res.status(StatusCodes.OK).json({ signMessage });
};

export default withErrorHandling(handler);