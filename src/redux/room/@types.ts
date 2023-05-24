// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EReaction, EVotingSystem } from '~src/types/enums';
import { IProposal, IRoom } from '~src/types/schema';

export interface IRoomStore {
    loading: boolean;
    error: string;
    room: IRoom | null;
    proposalCreation: IProposalCreation;
    currentStage: ERoomStage;
    proposals: IListingProposal[];
}

export interface IListingProposal extends Omit<IProposal, 'discussion' | 'description' | 'updated_at' | 'end_date' | 'start_date' | 'preparation_period' | 'comments' | 'reactions' | 'is_vote_results_hide_before_voting_ends' | 'voting_system' | 'timestamp' | 'snapshot_heights' | 'voting_system_options' | 'votes_result' | 'voting_strategies'> {
    comments_count: number;
    reactions_count: {
        [EReaction.LIKE]: number;
        [EReaction.DISLIKE]: number;
    };
}

export type IProposalCreation = {
    title: string;
    description: string;
    tags: string[];
    discussion?: string;
    start_date: string | null;
    end_date: string | null;
    voting_system: EVotingSystem;
    is_vote_results_hide_before_voting_ends: boolean;
    voting_system_options: IVotingSystemOption[];
}

export interface IVotingSystemOption {
    value: string;
}

export enum ERoomStage {
    PROPOSALS = 'proposals',
    NEW_PROPOSAL = 'new_proposal',
    SETTINGS = 'settings',
}