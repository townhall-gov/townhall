// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IRoom } from '~src/types/schema';

export interface IRoomStore {
    room: IRoom | null;
    proposalCreation: IProposalCreation;
    currentStage: ERoomStage;
}

export type IProposalCreation = {
    title: string;
    description: string;
    tags: string[];
    discussion?: string;
    start_date: string | null;
    end_date: string | null;
    preparation_period: string | null;
    is_vote_results_hide_before_voting_ends: boolean;
}

export enum ERoomStage {
    PROPOSALS = 'proposals',
    NEW_PROPOSAL = 'new_proposal',
    SETTINGS = 'settings',
}