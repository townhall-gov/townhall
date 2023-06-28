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
    MOONBEAM = 'moonbeam',
    MOONBASE = 'moonbase',
    MOONRIVER = 'moonriver',
    ASTAR = 'astar',
    ACALA = 'acala',
    STATEMINE = 'statemine',
    KARURA = 'karura',
    BIFROST = 'bifrost',
    PENDULUM = 'pendulum',
    KILT = 'kilt',
    CENTRIFUGE = 'centrifuge'
}

enum EReaction {
    LIKE = '👍🏻',
    DISLIKE = '👎🏻',
}

enum EPostType {
    DISCUSSION = 'discussion',
    PROPOSAL = 'proposal'
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

enum EVotingSystem {
    SINGLE_CHOICE_VOTING = 'single_choice_voting',
    APPROVAL_VOTING = 'approval_voting',
    QUADRATIC_VOTING = 'quadratic_voting',
    RANKED_CHOICE_VOTING = 'ranked_choice_voting',
    WEIGHTED_VOTING = 'weighted_voting',
    BASIC_VOTING = 'basic_voting',
}

enum EVotingStrategy {
    BALANCE_OF = 'balance_of',
    QUADRATIC_BALANCE_OF = 'quadratic_balance_of',
}

enum EProposalStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    CLOSED = 'closed',
}

export {
	EBlockchain,
	ESentiment,
	EWallet,
	EReaction,
	EAction,
	EVotingSystem,
	EVotingStrategy,
	EProposalStatus,
	EPostType
};