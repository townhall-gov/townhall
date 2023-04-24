// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

enum EWallet {
    POLKADOT_JS = 'polkadot-js',
    METAMASK = 'metamask'
}

enum EBlockchain {
    POLKADOT = 'polkadot',
    KUSAMA = 'kusama',
}

enum EStrategy {}
enum ESentiment {}

export {
	EBlockchain,
	ESentiment,
	EStrategy,
	EWallet
};