// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Web3 from 'web3';
import { getBlockTimeByHeightFromProviders } from './blockTime';
import { chainProperties, evmChains } from '~src/onchain-data/networkConstants';
const blockNumberThreshold = 3;

async function getExpectedFromProviders(providers: any[], chain: keyof typeof evmChains, lastHeightTime: {
    height: number;
    time: number;
}, targetTime: number) {
	const { height, time } = lastHeightTime;

	const gap = Math.abs(targetTime - time);
	const heightGap = Math.trunc(gap / chainProperties[chain].blockTime);

	let expectedHeight;
	if (time > targetTime) {
		expectedHeight = Math.max(height - heightGap, 1);
	} else {
		expectedHeight = Math.max(height + heightGap, 1);
	}

	const expectedTime = await getBlockTimeByHeightFromProviders(providers,  expectedHeight);
	const newGap = Math.abs(expectedTime - targetTime);
	return newGap < gap
		? {
			height: expectedHeight,
			time: expectedTime
		}
		: lastHeightTime;
}

async function getHeightByTimeFromProviders(providers: any[], chain: keyof typeof evmChains, targetTime: number, lastHeightTime: {
    height: number;
    time: number;
}): Promise<{
    height: number;
    time: number;
}> {
	const { height, time } = lastHeightTime;
	const blockTime = chainProperties[chain].blockTime;

	if (targetTime > time) {
		// Calculate the estimated number of blocks
		const timeDifference = targetTime - time;
		const estimatedBlocks = Math.floor(timeDifference / blockTime);

		// Calculate the estimated block height
		const estimatedBlockHeight = height + estimatedBlocks;
		return {
			height: estimatedBlockHeight,
			time: targetTime
		};
	}

	const gap = Math.abs(targetTime - time);
	if (gap <= blockNumberThreshold * blockTime) {
		return lastHeightTime;
	}

	const { height: expectedHeight, time: expectedTime } = await getExpectedFromProviders(
		providers,
		chain,
		lastHeightTime,
		targetTime
	);
	if (expectedHeight === height) {
		return lastHeightTime;
	}

	return await getHeightByTimeFromProviders(providers, chain, targetTime, {
		height: expectedHeight,
		time: expectedTime
	});
}

async function queryHeightFromOneProvider(provider: any) {
	const promises = [];
	for (let i = 0; i < 2; i++) {
		const web3 = new Web3(provider);
		promises.push(web3.eth.getBlockNumber());
	}

	return Promise.any(promises);
}

async function getBlockNumberFromProviders(providers: any[]) {

	const promises = [];
	for (const provider of providers) {
		if (provider) {
			promises.push(queryHeightFromOneProvider(provider));
		}
	}

	return Promise.any(promises);
}

export {
	getHeightByTimeFromProviders,
	getBlockNumberFromProviders
};
