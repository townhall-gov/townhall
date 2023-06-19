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
    DISCUSSION_COMMENT_EDIT_HISTORY = 'discussion-comment-edit-history',
    CAST_YOUR_VOTE = 'cast-your-vote',
    ALL_VOTES = 'all-votes',
    HOUSE_ROOMS = 'house-rooms',
    POST_LINK_MODAL = 'post-link-modal',
}

export enum EFooterType {
    NONE = 'none',
    FETCHING_WALLET_ACCOUNTS = 'fetching-wallet-accounts',
    COMMENT_SENTIMENT = 'sentiment',
    DISCUSSION_COMMENT_SENTIMENT = 'discussion-sentiment',
    COMMENT_EDIT_HISTORY = 'comment-edit-history',
    DISCUSSION_COMMENT_EDIT_HISTORY = 'discussion-comment-edit-history',
    CAST_YOUR_VOTE = 'cast-your-vote',
    POST_LINK_MODAL = 'post-link-modal',
}
export enum EContentType {
    NONE = 'none',
    CONNECT_WALLET = 'connect-wallet',
    FETCHING_WALLET_ACCOUNTS = 'fetching-wallet-accounts',
    MULTIPLE_JOINED_ROOMS = 'multiple-joined-rooms',
    COMMENT_SENTIMENT = 'sentiment',
    DISCUSSION_COMMENT_SENTIMENT = 'discussion-sentiment',
    COMMENT_EDIT_HISTORY = 'comment-edit-history',
    DISCUSSION_COMMENT_EDIT_HISTORY = 'discussion-comment-edit-history',
    CAST_YOUR_VOTE = 'cast-your-vote',
    ALL_VOTES = 'all-votes',
    HOUSE_ROOMS = 'house-rooms',
    POST_LINK_MODAL = 'post-link-modal',
}