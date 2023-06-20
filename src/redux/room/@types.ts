// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IPostLinkData } from 'pages/api/auth/data/post-link-data';
import { EReaction, EVotingSystem } from '~src/types/enums';
import { IDiscussion, IPostLink, IProposal, IRoom } from '~src/types/schema';

export interface IRoomStore {
    loading: boolean;
    error: string;
    room: IRoom | null;
    proposalCreation: IProposalCreation;
    discussionCreation: IDiscussionCreation;
    roomSettings: IRoomSettings;
    currentStage: ERoomStage;
    proposals: IListingProposal[];
    discussions: IListingDiscussion[];
}

export interface IListingProposal extends Omit<IProposal, 'discussion' | 'description' | 'updated_at' | 'preparation_period' | 'comments' | 'reactions' | 'is_vote_results_hide_before_voting_ends' | 'voting_system' | 'timestamp' | 'snapshot_heights' | 'voting_system_options' | 'voting_strategies' | 'post_link' | 'post_link_data'> {
    comments_count: number;
    reactions_count: {
        [EReaction.LIKE]: number;
        [EReaction.DISLIKE]: number;
    };
}

export interface IListingDiscussion extends Omit<IDiscussion, 'description' | 'updated_at' | 'comments' | 'reactions' | 'post_link' | 'post_link_data'> {
    comments_count: number;
    reactions_count: {
        [EReaction.LIKE]: number;
        [EReaction.DISLIKE]: number;
    };
}

export type IProposalCreation = {
    url: string;
    postLink: IPostLink | null;
    postLinkData: IPostLinkData | null;
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

export type IDiscussionCreation = {
    title: string;
    description: string;
    tags: string[];
}

export type IRoomSettings = {
    min_token_to_create_proposal_in_room: number;
};

export interface IVotingSystemOption {
    value: string;
}

export enum ERoomStage {
    PROPOSALS = 'proposals',
    NEW_PROPOSAL = 'new_proposal',
    SETTINGS = 'settings',
    DISCUSSIONS = 'discussions'
}