// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import web3 from 'web3';
import { evmChains } from '../../constants';

type TEvmProviderMap = {
	[k in keyof typeof evmChains]: (any)[];
};

const evmProviderMap: TEvmProviderMap = {
	acala: [],
	astar: [],
	moonbase: [],
	moonbeam: [],
	moonriver: []
};

async function cleanEvmChainProviders() {
	for (const chain in evmProviderMap) {
		const providers = evmProviderMap[chain as keyof typeof evmChains];
		for (let provider of providers) {
			if (provider) {
				provider.removeAllListeners();
				provider.destroy();
				(provider as any) = null;
			}
		}
		evmProviderMap[chain as keyof typeof evmChains] = [];
	}
}

function createProvider(url: string) {
	try {
		if (typeof url === 'string' && url.startsWith('wss')) {
			return new web3.providers.WebsocketProvider(url, {
				reconnect: {
					auto: false
				}
			});
		}
		return new web3.providers.HttpProvider(url, {
			keepAlive: false
		});
	} catch (e) {
		console.info(`Can not construct provider from ${url}, ignore`);
	}
}

async function createProviderForEvmChain(chain: keyof typeof evmChains, endpoints: string[], logger = console) {
	evmProviderMap[chain] = [];
	for (const endpoint of endpoints) {
		if (!endpoint) {
			continue;
		}

		try {
			const provider = createProvider(endpoint);
			if (provider) {
				evmProviderMap[chain].push(provider);
			} else {
				console.info(`${ chain }: ${ endpoint } provider is undefined!`);
			}
		} catch (e) {
			logger.info(
				`Can not connected to ${ endpoint } in x seconds, just disconnect it`
			);
		}
	}
}

function getProvidersForEvmChain(chain: keyof typeof evmChains) {
	return evmProviderMap[chain];
}

export {
	createProviderForEvmChain,
	getProvidersForEvmChain,
	cleanEvmChainProviders
};