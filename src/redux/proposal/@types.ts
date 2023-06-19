// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ESentiment } from '~src/types/enums';
import { IBalanceWithNetwork, IHistoryComment, IHistoryReply, IReply, IVote } from '~src/types/schema';
import { IComment, IProposal } from '~src/types/schema';
import { IVotingSystemOption } from '../room/@types';

export interface IProposalStore {
    loading: boolean;
    error: string | null;
    proposal: IProposal | null;
    voteCreation: IVoteCreation;
    vote: IVote | null;
    votes: IVote[];
    commentCreation: ICommentCreation;
    replyCreation:ICommentCreation;
    isAllCommentsVisible: boolean;
    isAllRepliesVisible:boolean;
    editableComment: IComment | null;
    editableReply: IReply | null;
    commentEditHistory: IHistoryComment[];
    replyEditHistory: IHistoryReply[];
    isReplyBoxVisible:IReplyBoxVisible;
    isRepliesVisible:IRepliesVisible;
}

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