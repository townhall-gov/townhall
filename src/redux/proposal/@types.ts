// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ESentiment } from '~src/types/enums';
import { IProposal } from '~src/types/schema';

export interface IProposalStore {
    loading: boolean;
    error: string | null;
    proposal: IProposal | null;
    commentCreation: ICommentCreation;
}

export type ICommentCreation = {
    content: string;
    sentiment: ESentiment;
};