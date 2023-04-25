// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IHouse, IRoom } from '~src/types/schema';

export interface IRoomsStore {
    rooms: IRoom[];
    joinOrRemoveRoom: string | null; // room_id
    error: string | null;
    roomCreation: IRoomCreation;
}

export interface IRoomCreation {
    currentStage: ERoomCreationStage;
    getting_started: 'getting_started' | null;
    select_house: IHouse | null;
    project_details: IProjectDetails | null;
    creator_details: ICreatorDetails | null;
    project_socials: IProjectSocial[] | null;
}

export enum ERoomCreationStage {
    GETTING_STARTED = 'getting_started',
    SELECT_HOUSE = 'select_house',
    PROJECT_DETAILS = 'project_details',
    CREATOR_DETAILS = 'creator_details',
    PROJECT_SOCIALS = 'project_socials',
}

export interface IProjectDetails {
    name: string;
}

export interface ICreatorDetails {
    name: string;
    email: string;
    phone: string;
}

export interface IProjectSocial {
    type: ESocial;
    url: string;
}

export enum ESocial{
    GITHUB = 'github',
    DISCORD = 'discord',
    TWITTER = 'twitter',
    TELEGRAM = 'telegram',
    REDDIT = 'reddit',
}