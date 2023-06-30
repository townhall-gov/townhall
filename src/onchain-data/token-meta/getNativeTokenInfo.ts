// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { chainProperties } from '../networkConstants';
import { createAndGetApis } from '../utils/chain/apis';

async function getNativeTokenInfoFromOneApi(api: ApiPromise) {
	const properties = await api.rpc.system.properties();
	const { tokenSymbol, tokenDecimals, ss58Format } = properties;
	if (tokenSymbol.isNone || tokenDecimals.isNone || ss58Format.isNone) {
		throw new Error('Unexpected token info');
	}

	return {
		decimals: tokenDecimals.value[0].toString(),
		ss58Format: ss58Format.toJSON(),
		symbol: tokenSymbol.value[0].toString()
	};
}

async function getNativeTokenInfoFromApis(apis: ApiPromise[]) {
	const promises = [];
	for (const api of apis) {
		promises.push(getNativeTokenInfoFromOneApi(api));
	}

	return Promise.any(promises);
}

async function getNativeTokenInfo(chain: keyof typeof chainProperties) {
	const apis = await createAndGetApis(chain as any);
	if (!apis || !apis.length || apis.every((api) => !api.isConnected)) {
		throw new Error('No apis connected');
	}
	try {
		const tokenInfo =  await getNativeTokenInfoFromApis(apis);
		apis.forEach((api) => api.disconnect());
		return tokenInfo;
	} catch (error) {
		apis.forEach((api) => api.disconnect());
		return {
			decimals: '',
			ss58Format: '',
			symbol: ''
		} as {
			decimals: string;
			ss58Format: string;
			symbol: string;
		};
	}
}

export {
	getNativeTokenInfo
};