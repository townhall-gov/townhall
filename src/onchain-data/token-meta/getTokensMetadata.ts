// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { chainProperties } from '../networkConstants';
import { createAndGetApis } from '../utils/chain/apis';

const getTokenId = (tokenId: any) => {
	if (typeof tokenId === 'string') {
		return (tokenId || '').replace(/,/g, '');
	}
	if (typeof tokenId === 'object') {
		if (tokenId.ForeignAssetId) {
			return {
				ForeignAsset: Number((tokenId.ForeignAssetId || '').replace(/,/g, ''))
			};
		}
		if (tokenId.ForeignAsset) {
			return {
				ForeignAsset: Number((tokenId.ForeignAsset || '').replace(/,/g, ''))
			};
		}
		if (tokenId.StableAssetId) {
			return {
				StableAsset: Number((tokenId.StableAssetId || '').replace(/,/g, ''))
			};
		}
		if (tokenId.NativeAssetId && typeof tokenId.NativeAssetId === 'object') {
			return tokenId.NativeAssetId;
		}
		return tokenId;
	}
	return null;
};

export type TTokenMetadata = {
    decimals: number;
    name: string;
    symbol: string;
    tokenId: string;
} | {
    name: string;
    symbol: string;
    decimals: number;
    tokenId: {
		VSToken: string;
	} | {
		Token: string;
	} | {
		Stable: string;
	} | {
		Native: string;
	} | {
        Erc20: string;
    } | {
        ForeignAsset: number;
    } | {
        StableAsset: number;
    } | string | null
};

async function getTokensMetadataUsingAssetsMetadataFromOneApi(api: ApiPromise) {
	if (!api.query.assets?.metadata) {
		throw new Error(`${api} does not support assets metadata query`);
	}
	const tokensMetadata = await api.query.assets.metadata.entries();
	const newTokensMetadata: TTokenMetadata[] = [];
	tokensMetadata.forEach((tokenMetadata) => {
		if (tokenMetadata[0] && tokenMetadata[1]) {
			const tokenId = getTokenId((tokenMetadata[0]?.toHuman() as any)?.[0]);
			const newTokenMetadata = tokenMetadata[1].toHuman() as any;
			newTokensMetadata.push({
				decimals: Number((newTokenMetadata.decimals || '').replace(/,/g, '')),
				name: newTokenMetadata.name,
				symbol: newTokenMetadata.symbol,
				tokenId: tokenId || ''
			});
		}
	});

	return newTokensMetadata;
}

async function getTokensMetadataUsingAssetRegistryAssetMetadatasFromOneApi(api: ApiPromise) {
	if (!api.query.assetRegistry?.assetMetadatas) {
		throw new Error(`${api} does not support assets metadata query`);
	}
	const tokensMetadata = await api.query.assetRegistry?.assetMetadatas.entries();
	const newTokensMetadata: TTokenMetadata[] = [];
	tokensMetadata.forEach((tokenMetadata) => {
		if (tokenMetadata[0] && tokenMetadata[1]) {
			const tokenId = getTokenId((tokenMetadata[0]?.toHuman() as any)?.[0]);
			const newTokenMetadata = tokenMetadata[1].toHuman() as any;
			newTokensMetadata.push({
				decimals: Number((newTokenMetadata.decimals || '').replace(/,/g, '')),
				name: newTokenMetadata.name,
				symbol: newTokenMetadata.symbol,
				tokenId: tokenId
			});
		}
	});

	return newTokensMetadata;
}

async function getTokensMetadataUsingORMLAssetRegistryMetadataFromOneApi(api: ApiPromise) {
	if (!api.query.ormlAssetRegistry?.metadata) {
		throw new Error(`${api} does not support assets metadata query`);
	}
	const tokensMetadata = await api.query.ormlAssetRegistry?.metadata.entries();
	const newTokensMetadata: TTokenMetadata[] = [];
	tokensMetadata.forEach((tokenMetadata) => {
		if (tokenMetadata[0] && tokenMetadata[1]) {
			const tokenId = getTokenId((tokenMetadata[0]?.toHuman() as any)?.[0]);
			const newTokenMetadata = tokenMetadata[1].toHuman() as any;
			newTokensMetadata.push({
				decimals: Number((newTokenMetadata.decimals || '').replace(/,/g, '')),
				name: newTokenMetadata.name,
				symbol: newTokenMetadata.symbol,
				tokenId: tokenId
			});
		}
	});

	return newTokensMetadata;
}

async function getTokensMetadataFromApis(apis: ApiPromise[], chain: keyof typeof chainProperties) {
	const promises = [];
	for (const api of apis) {
		if (['statemine', 'moonriver', 'moonbeam', 'moonbase', 'astar'].includes(chain)) {
			promises.push(getTokensMetadataUsingAssetsMetadataFromOneApi(api));
		} else if (['karura', 'acala', 'bifrost'].includes(chain)) {
			promises.push(getTokensMetadataUsingAssetRegistryAssetMetadatasFromOneApi(api));
		} else if (['centrifuge'].includes(chain)) {
			promises.push(getTokensMetadataUsingORMLAssetRegistryMetadataFromOneApi(api));
		}
	}

	return Promise.any(promises);
}

async function getTokensMetadata(chain: keyof typeof chainProperties) {
	const apis = await createAndGetApis(chain);
	if (!apis || !apis.length || apis.every((api) => !api.isConnected)) {
		throw new Error('No apis connected');
	}
	try {
		const tokensMetadata =  await getTokensMetadataFromApis(apis, chain);
		apis.forEach((api) => api.disconnect());
		return tokensMetadata;
	} catch (error) {
		apis.forEach((api) => api.disconnect());
		return [] as TTokenMetadata[];
	}
}

export {
	getTokensMetadata
};