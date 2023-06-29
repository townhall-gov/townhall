// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ApiPromise, WsProvider } from '@polkadot/api';
import { rejectInTime } from '../utils/rejectInTime';
import { chains } from '../../constants';
import { getEndpoints } from '../utils/chainEndpoints';
import { chainProperties } from '~src/onchain-data/networkConstants';

const nodeTimeoutSeconds = 20;

type IChainApis = {
  [k in keyof typeof chains]: INodeInfo[]
}
interface INodeInfo {
  api: ApiPromise;
  endpoint: string;
}
/**
 *
 * @type {
 *   network: [
 *     {
 *       endpoint,
 *       api
 *     },
 *   ]
 * }
 */
const chainApis: IChainApis = {
	acala: [],
	astar: [],
	kusama: [],
	polkadot: []
};

async function cleanChainApis() {
	for (const network in chainApis) {
		const apis = chainApis[network as keyof typeof chains];
		for (let api of apis) {
			await api.api.disconnect();
			(api as any) = null;
		}
		chainApis[network as keyof typeof chains] = [];
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function reConnect(network: keyof typeof chains, endpoint: string, logger = console) {
	const nowApis = chainApis[network] || [];

	const index = nowApis.findIndex(({ endpoint: url }) => url === endpoint);
	if (index >= 0) {
		const [targetApi] = nowApis.splice(index, 1);
		if (targetApi && targetApi.api) {
			await targetApi.api.disconnect();
		}
	}

	console.log(`re-connect network: ${ network } with endpoint: ${ endpoint }`);
	await createApi(network, endpoint);
	logger.info(`Reconnect to ${ network } ${ endpoint }`);
}

async function createApi(network: keyof typeof chains, endpoint: string, logger = console) {
	const provider = new WsProvider(endpoint, 100);

	let api;
	try {
		api = await ApiPromise.create({ provider });
	} catch (e) {
		logger.error(`Can not connect to ${ network } ${ endpoint }`);
		throw e;
	}

	api.on('error', () => {
		// reConnect(network, endpoint, logger);
	});
	api.on('disconnected', () => {
		// reConnect(network, endpoint, logger);
	});

	const nowApis = chainApis[network] || [];
	if (nowApis.findIndex((api) => api.endpoint === endpoint) >= 0) {
		logger.info(`${ network } ${ endpoint } existed, ignore`);
		return;
	}

	const nodeInfo: INodeInfo = {
		api: await api.isReady,
		endpoint
	};
	chainApis[network] = [...nowApis, nodeInfo];
	console.log(`${ network }: ${ endpoint } created!`);
}

async function createApiInLimitTime(network: keyof typeof chains, endpoint: string, logger = console) {
	return Promise.race([
		createApi(network, endpoint, logger),
		rejectInTime(nodeTimeoutSeconds)
	]);
}

async function createApiForChain(chain: keyof typeof chains, endpoints: string[], logger = console) {
	for (const endpoint of endpoints) {
		if (!endpoint) {
			continue;
		}

		try {
			await createApiInLimitTime(chain, endpoint);
		} catch (e) {
			logger.info(
				`Can not connected to ${ endpoint } in ${ nodeTimeoutSeconds } seconds, just disconnect it`
			);
		}
	}
}

async function getApis(chain: keyof typeof chains) {
	const apis = (chainApis[chain] || []).map(({ api }) => api);
	let isAllDisconnected = true;
	for (const api of apis) {
		if (api.isConnected) {
			isAllDisconnected = false;
			break;
		}
	}
	if (isAllDisconnected) {
		const chainEndpoints = getEndpoints();
		const chainEndpointsForChain = chainEndpoints.find((chainInfo) => chainInfo.chain === chain);
		if (chainEndpointsForChain) {
			const promises = [];
			for (const endpoint of chainEndpointsForChain.endpoints) {
				if (endpoint) {
					promises.push(createApiInLimitTime(chain, endpoint));
				}
			}
			try {
				await Promise.any(promises);
			} catch (error) {
				console.info('unknown error', error);
			}
		}
	}
	return (chainApis[chain] || []).map(({ api }) => api);
}

async function createAndGetApi(network: keyof typeof chainProperties, endpoint: string, logger = console) {
	const provider = new WsProvider(endpoint, 100);

	let api;
	try {
		api = await ApiPromise.create({ provider });
		return await api.isReady;
	} catch (e) {
		logger.error(`Can not connect to ${ network } ${ endpoint }`);
		throw e;
	}
}

async function createAndGetApiInLimitTime(network: keyof typeof chainProperties, endpoint: string, logger = console) {
	return Promise.race([
		createAndGetApi(network, endpoint, logger),
		rejectInTime(nodeTimeoutSeconds)
	]) as Promise<ApiPromise>;
}

async function createAndGetApis(chain: keyof typeof chainProperties) {
	const chainEndpoints = chainProperties?.[chain]?.endpoints;
	const apis: ApiPromise[] = [];
	if (chainEndpoints) {
		const promises: Promise<ApiPromise>[] = [];
		for (const endpoint of chainEndpoints) {
			if (endpoint) {
				promises.push(createAndGetApiInLimitTime(chain, endpoint));
			}
		}
		try {
			const api = await Promise.any(promises);
			apis.push(api);
		} catch (error) {
			console.info('unknown error', error);
		}
	}
	return apis;
}

function logApiStatus(logger = console) {
	Object.entries(chainApis).map(([chain, apis]) => {
		logger.info(`chain: ${ chain }`);
		for (const { endpoint, api } of apis) {
			logger.info(`\t ${ endpoint } connected: ${ api.isConnected }`);
		}
	});
}

export {
	createApi,
	createApiForChain,
	createApiInLimitTime,
	getApis,
	logApiStatus,
	cleanChainApis,
	createAndGetApis
};
