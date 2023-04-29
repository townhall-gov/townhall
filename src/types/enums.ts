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

enum EStrategy {
    SINGLE = 'single'
}

enum EReaction {
    LIKE = '👍🏻',
    DISLIKE = '👎🏻',
}

enum ESentiment {
    COMPLETELY_AGAINST = 'completely_against',
    SLIGHTLY_AGAINST = 'slightly_against',
    NEUTRAL = 'neutral',
    SLIGHTLY_FOR = 'slightly_for',
    COMPLETELY_FOR = 'completely_for',
}

enum EAction {
    ADD = 'add',
    DELETE = 'delete',
    EDIT = 'edit'
}

export {
	EBlockchain,
	ESentiment,
	EStrategy,
	EWallet,
	EReaction,
	EAction
};