// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isWeb3Injected, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedWindow, Injected, InjectedAccount } from '@polkadot/extension-inject/types';
import { stringToHex } from '@polkadot/util';
import Web3 from 'web3';
import { APPNAME } from '~src/global/appName';
import { EWallet } from '~src/ui-components/WalletIcon';
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

export const signByMetaMask = async (text: string, address: string) => {
	const newWindow = (window as any);
	if (!newWindow.ethereum || !newWindow.ethereum.isMetaMask) {
		throw new Error('No MetaMask detected.');
	}

	const hex = stringToHex(text);
	return await newWindow.ethereum.request({
		method: 'personal_sign',
		params: [hex, address]
	});
};

export const signMessage = async (text: string, address: string) => {
	if (!address) {
		throw new Error('Sign address is missing.');
	}

	if (Web3.utils.isAddress(address)) {
		return await signByMetaMask(text, address);
	}

	if (!isWeb3Injected) {
		throw new Error('Polkadot extension is not installed.');
	}

	await web3Enable(APPNAME);
	const injector = await web3FromAddress(address);

	const data = stringToHex(text);
	const result = await injector.signer.signRaw({
		address,
		data,
		types: 'bytes'
	});
	return result?.signature;
};

export const signApiData = async (data: Object, address: string) => {
	const dataToSign = {
		...data,
		timestamp: parseInt(String(Date.now() / 1000))
	};

	const msg = JSON.stringify(dataToSign);
	const signature = await signMessage(msg, address);

	return {
		address,
		data: dataToSign,
		signature
	};
};