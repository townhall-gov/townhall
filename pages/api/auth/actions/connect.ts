// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import { EWallet } from '~src/types/enums';
import { IToken } from '~src/auth/types';
import authServiceInstance from '~src/auth';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export interface IConnectBody {
    address: string;
    wallet: EWallet;
	signature: string;
}

const handler: TNextApiHandler<IToken, IConnectBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { address, wallet, signature } = req.body;

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid address.' });
	}
	if (!signature) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid signature.' });
	}
	if (!wallet || !Object.values(EWallet).includes(wallet)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid wallet.' });
	}

	try {
		const { token, joined_houses } = await authServiceInstance.Connect(address, wallet, signature);
		res.status(StatusCodes.OK).json({ joined_houses, token });
	} catch (error) {
		res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}
};

export default withErrorHandling(handler);