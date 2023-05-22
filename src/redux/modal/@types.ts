// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export interface IModalStore {
    open: boolean;
    footerType?: EFooterType;
    contentType?: EContentType;
    titleType?: ETitleType
}

export enum ETitleType {
    NONE = 'none',
    CONNECT_WALLET = 'connect-wallet',
    FETCHING_WALLET_ACCOUNTS = 'fetching-wallet-accounts',
    MULTIPLE_JOINED_ROOMS = 'multiple-joined-rooms',
    COMMENT_EDIT_HISTORY = 'comment-edit-history',
    CAST_YOUR_VOTE = 'cast-your-vote',
}

export enum EFooterType {
    NONE = 'none',
    FETCHING_WALLET_ACCOUNTS = 'fetching-wallet-accounts',
    COMMENT_SENTIMENT = 'sentiment',
    COMMENT_EDIT_HISTORY = 'comment-edit-history',
    CAST_YOUR_VOTE = 'cast-your-vote',
}
export enum EContentType {
    NONE = 'none',
    CONNECT_WALLET = 'connect-wallet',
    FETCHING_WALLET_ACCOUNTS = 'fetching-wallet-accounts',
    MULTIPLE_JOINED_ROOMS = 'multiple-joined-rooms',
    COMMENT_SENTIMENT = 'sentiment',
    COMMENT_EDIT_HISTORY = 'comment-edit-history',
    CAST_YOUR_VOTE = 'cast-your-vote',
}