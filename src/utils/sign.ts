// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isWeb3Injected, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { stringToHex } from '@polkadot/util';
import Web3 from 'web3';
import { APPNAME } from '~src/global/appName';

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

export const signMessage = async (text: string, address: string): Promise<string> => {
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