// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import { userCollection } from '~src/services/firebase/utils';
import { IUser } from '~src/types/schema';
import { EWallet } from '~src/types/enums';

export interface IConnectBody {
    address: string;
    wallet: EWallet;
}

const handler: TNextApiHandler<IUser, IConnectBody> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { address, wallet } = req.body;

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid address' });
	}
	if (!wallet || !Object.values(EWallet).includes(wallet)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid wallet' });
	}

	const user: IUser = {
		address: address,
		bio: null,
		img_url: null,
		joined_houses: [],
		username: null,
		wallet: wallet
	};

	const userDocRef = userCollection.doc(address);
	const userDocSnapshot = await userDocRef.get();

	if (userDocSnapshot && userDocSnapshot.exists) {
		const data = userDocSnapshot.data();
		if (data) {
			if (data.bio && typeof data.bio === 'string') {
				user.bio = data.bio;
			}
			if (data.img_url && typeof data.img_url === 'string') {
				user.img_url = data.img_url;
			}
			if (data.username && typeof data.username === 'string') {
				user.username = data.username;
			}
		}
	} else {
		await userDocRef.set(user, { merge: true });
	}

	res.status(StatusCodes.OK).json(user);
};

export default withErrorHandling(handler);