// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { chains } from '../../constants';

type TChainEndpointsMap = {
	chain: keyof typeof chains;
	endpoints: string[];
}[];

const chainEndpoints: TChainEndpointsMap = [
	{
		chain: 'kusama',
		endpoints: [
			'wss://kusama.api.onfinality.io/public-ws',
			'wss://kusama-rpc.dwellir.com',
			'wss://kusama-rpc.polkadot.io',
			'wss://rpc.ibp.network/kusama',
			'wss://rpc.dotters.network/kusama'
		]
	},
	{
		chain: 'polkadot',
		endpoints: [
			'wss://polkadot.api.onfinality.io/public-ws',
			'wss://polkadot-rpc.dwellir.com',
			'wss://rpc.polkadot.io',
			'wss://rpc.ibp.network/polkadot',
			'wss://rpc.dotters.network/polkadot'
		]
	}
];

const getEndpoints = () => {
	return chainEndpoints;
};

export {
	getEndpoints
};
