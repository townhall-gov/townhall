// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ESentiment } from '~src/types/enums';
import { IHistoryComment, IHistoryReply, IReply } from '~src/types/schema';
import { IComment, IDiscussion } from '~src/types/schema';
import { IRepliesVisible } from '../proposal/@types';

export interface IDiscussionStore {
    loading: boolean;
    error: string | null;
    discussion: IDiscussion | null;
    commentCreation: ICommentCreation;
    replyCreation:ICommentCreation;
    isAllCommentsVisible: boolean;
    isAllRepliesVisible:boolean;
    editableComment: IComment | null;
    editableReply: IReply | null;
    editableDiscussion: TEditableDiscussion;
    commentEditHistory: IHistoryComment[];
    replyEditHistory: IHistoryReply[];
    replyComment: IComment | null;
    isRepliesVisible:IRepliesVisible;
}

export type ICommentCreation = {
    content: string;
    comment_open: boolean;
    sentiment: ESentiment;
};

export enum EEditableDiscussionAction {
    EDIT_DISCUSSION = 'EDIT_DISCUSSION',
    PREVIEWING_DISCUSSION = 'PREVIEWING_DISCUSSION',
}

export type TEditableDiscussion = {
    action: EEditableDiscussionAction;
    title: string;
    description: string;
    tags: string[];
};