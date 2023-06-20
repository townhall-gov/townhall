// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ESentiment } from '~src/types/enums';
import { IBalanceWithNetwork, IHistoryComment, IHistoryReply, IPostLink, IReply, IVote } from '~src/types/schema';
import { IComment, IProposal } from '~src/types/schema';
import { IVotingSystemOption } from '../room/@types';
import { IPostLinkData } from 'pages/api/auth/data/post-link-data';

export interface IProposalStore {
    loading: boolean;
    error: string | null;
    proposal: IProposal | null;
    voteCreation: IVoteCreation;
    vote: IVote | null;
    votes: IVote[];
    commentCreation: ICommentCreation;
    replyCreation: ICommentCreation;
    postLinkCreation: IPostLinkCreation;
    isAllCommentsVisible: boolean;
    isAllRepliesVisible:boolean;
    editableComment: IComment | null;
    editableReply: IReply | null;
    commentEditHistory: IHistoryComment[];
    replyEditHistory: IHistoryReply[];
    replyComment: IComment | null;
    isRepliesVisible:IRepliesVisible;
}

export enum EPostLinkCreationAction {
    FETCHING_POST_LINK_DATA = 'FETCHING_POST_LINK',
    AUTO_FILLING_POST_LINK_DATA = 'AUTO_FILLING_POST_LINK_DATA',
    PREVIEWING_POST_LINK_DATA = 'PREVIEWING_POST_LINK_DATA',
}

export type IPostLinkCreation = {
    action: EPostLinkCreationAction;
    url: string;
    postLink: IPostLink | null;
    postLinkData: IPostLinkData | null;
};

export type ICommentCreation = {
    content: string;
    comment_open:boolean;
    sentiment: ESentiment;
};

export type IRepliesVisible = {
    replies_comment_id:string;
    replies_isVisible:boolean;
}

export type IReplyBoxVisible = {
    replyBox_comment_id:string;
    replyBox_isVisible:boolean
};

export type IVoteCreation = {
    options: IVotingSystemOption[];
    balances: IBalanceWithNetwork[];
    note?: string;
};