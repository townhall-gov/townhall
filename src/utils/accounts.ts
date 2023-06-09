// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isWeb3Injected } from '@polkadot/extension-dapp';
import { InjectedWindow, Injected, InjectedAccount } from '@polkadot/extension-inject/types';
import { APPNAME } from '~src/global/appName';
import { EWallet } from '~src/types/enums';
import getErrorMessage from '~src/utils/getErrorMessage';

const UNKNOWN_ERROR_WHILE_FETCHING_ACCOUNTS = 'Something went wrong while fetching accounts. Please try again later or Refetch.';

const getAccounts = async (chosenWallet: EWallet): Promise<{
    accounts: InjectedAccount[];
    error: string;
}> => {
	const injectedWindow = window as Window & InjectedWindow;

	const wallet = isWeb3Injected
		? injectedWindow.injectedWeb3[chosenWallet.toString()]
		: null;

	if (!wallet) {
		return {
			accounts: [],
			error: 'Extension not found.'
		};
	}

	let injected: Injected | undefined;
	try {
		injected = await new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error('Wallet Timeout'));
			}, 60000); // wait 60 sec

			if(wallet && wallet.enable) {
				wallet.enable(APPNAME)
					.then((value) => { clearTimeout(timeoutId); resolve(value); })
					.catch((error) => { clearTimeout(timeoutId); reject(error); });
			}
		});
	} catch (err) {
		return {
			accounts: [],
			error: getErrorMessage(err, UNKNOWN_ERROR_WHILE_FETCHING_ACCOUNTS)
		};
	}
	if (!injected) {
		return {
			accounts: [],
			error: 'Injected not found.'
		};
	}

	const accounts = await injected.accounts.get();
	return {
		accounts,
		error: ''
	};
};
export default getAccounts;

export const getMetamaskAccounts = async (): Promise<{
    accounts: InjectedAccount[];
    error: string;
}> => {
	const ethereum = (window as any).ethereum;

	if (!ethereum) {
		return {
			accounts: [],
			error: 'Extension not found.'
		};
	}

	try {
		const addresses = await ethereum.request({ method: 'eth_requestAccounts' });
		return {
			accounts: addresses.map((address: string): InjectedAccount => {
				const account = {
					address: address.toLowerCase(),
					meta: {
						genesisHash: null,
						name: 'metamask',
						source: 'metamask'
					}
				};
				return account;
			}),
			error: ''
		};
	} catch (error) {
		return {
			accounts: [],
			error: getErrorMessage(error, UNKNOWN_ERROR_WHILE_FETCHING_ACCOUNTS)
		};
	}
};
