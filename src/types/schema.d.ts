// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EWallet } from '~src/ui-components/WalletIcon';

interface IUser {
	address: string;
	wallet: EWallet;
	username: string | null;
	bio: string | null;
	img_url: string | null;
}

export {
	IUser
};