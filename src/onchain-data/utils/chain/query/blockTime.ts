// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GenericExtrinsic } from '@polkadot/types';
import { Vec } from '@polkadot/types-codec';
import { AnyTuple } from '@polkadot/types-codec/types';

function extractBlockTime(extrinsics: Vec<GenericExtrinsic<AnyTuple>>) {
	const setTimeExtrinsic = extrinsics.find(
		(ex) => ex.method.section === 'timestamp' && ex.method.method === 'set'
	);
	if (setTimeExtrinsic) {
		const { args } = setTimeExtrinsic.method.toJSON();
		return args.now;
	}
}

export {
	extractBlockTime
};
