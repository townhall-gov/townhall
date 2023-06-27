// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isWeb3Injected, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { stringToHex } from '@polkadot/util';
import Web3 from 'web3';
import { APPNAME } from '~src/global/appName';
import { TVotePayload, getVoteTypeData } from './typedData/vote';
import { TProposalPayload } from 'pages/api/auth/actions/createProposal';
import { getProposalTypeData } from './typedData/proposal';

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

export const signTypedDataByMetaMask = async (typedDataJSON: string, address: string) => {
	const newWindow = (window as any);
	if (!newWindow.ethereum || !newWindow.ethereum.isMetaMask) {
		throw new Error('No MetaMask detected.');
	}

	const signature = await newWindow.ethereum.request({
		method: 'eth_signTypedData_v4',
		params: [address, typedDataJSON]
	});

	return signature;
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
	if (injector.signer.signRaw) {
		const result = await injector.signer.signRaw({
			address,
			data,
			type: 'bytes'
		});
		return result?.signature;
	}
	throw new Error('Signer does not support signRaw.');
};

export const signApiData = async <T>(data: T, address: string) => {
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

export const signVoteData = async (data: TVotePayload, address: string) => {
	const dataToSign = {
		...data
	};

	let signature = '';

	if (!address) {
		throw new Error('Sign address is missing.');
	}

	if (Web3.utils.isAddress(address)) {
		const text = JSON.stringify(getVoteTypeData(dataToSign, true));
		signature =  await signTypedDataByMetaMask(text, address);
	} else {
		if (!isWeb3Injected) {
			throw new Error('Polkadot extension is not installed.');
		}

		await web3Enable(APPNAME);
		const injector = await web3FromAddress(address);
		console.log(injector.signer.signRaw);
		if (injector.signer.signRaw) {
			const data  = JSON.stringify(getVoteTypeData(dataToSign, false));
			const result = await injector.signer.signRaw({
				address,
				data,
				type: 'payload'
			});
			signature = result?.signature;
		} else {
			throw new Error('Signer does not support signRaw.');
		}
	}

	return {
		address,
		data: dataToSign,
		signature
	};
};

export const signProposalData = async (data: TProposalPayload, address: string) => {
	const dataToSign = {
		...data
	};

	let signature = '';

	if (!address) {
		throw new Error('Sign address is missing.');
	}

	if (Web3.utils.isAddress(address)) {
		const typedData = getProposalTypeData(dataToSign, true);
		const text = JSON.stringify(typedData);
		signature =  await signTypedDataByMetaMask(text, address);
	} else {
		if (!isWeb3Injected) {
			throw new Error('Polkadot extension is not installed.');
		}

		await web3Enable(APPNAME);
		const injector = await web3FromAddress(address);

		if (injector.signer.signRaw) {
			const typedData = getProposalTypeData(dataToSign, false);
			const data = JSON.stringify(typedData);
			const result = await injector.signer.signRaw({
				address,
				data,
				type: 'payload'
			});
			signature = result?.signature;
		} else {
			throw new Error('Signer does not support signRaw.');
		}
	}

	return {
		address,
		data: dataToSign,
		signature
	};
};