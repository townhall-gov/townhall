// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IHouseRoom } from 'pages/api/house/rooms';
import { EReaction } from '~src/types/enums';
import { IHouse, IProposal, IRoom } from '~src/types/schema';

export interface IHouseStore {
    loading: boolean;
    error: string;
    house: IHouse | null;
    houseRooms: IHouseRoom[] | null;
    houseDefaultRoom: IRoom | null;
    houseSettings: IHouseSettings;
    currentStage: EHouseStage;
    proposals: IListingProposal[];
}

export interface IListingProposal extends Omit<IProposal, 'discussion' | 'description' | 'updated_at' | 'preparation_period' | 'comments' | 'reactions' | 'is_vote_results_hide_before_voting_ends' | 'voting_system' | 'timestamp' | 'snapshot_heights' | 'voting_system_options' | 'voting_strategies' | 'post_link' | 'post_link_data'> {
    comments_count: number;
    reactions_count: {
        [EReaction.LIKE]: number;
        [EReaction.DISLIKE]: number;
    };
}

export type IHouseSettings = {
    min_token_to_create_room: number;
};

export enum EHouseStage {
    PROPOSALS = 'proposals',
    DISCUSSIONS = 'discussions',
    NEW_PROPOSAL = 'new_proposal',
    SETTINGS = 'settings',
}