// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import * as sigUtil from '@metamask/eth-sig-util';
export const verifyMetamaskSignature = (message: string, address: string, signature: string): boolean => {
	const msgParams = {
		data: message,
		signature: signature
	};

	const recovered = sigUtil.recoverPersonalSignature(msgParams as any);
	return `${recovered}`.toLowerCase() === `${address}`.toLowerCase();
};