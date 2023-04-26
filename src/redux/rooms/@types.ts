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
    room_details: IRoomDetails | null;
    creator_details: Omit<ICreatorDetails, 'address'> | null;
    room_socials: IRoomSocial[] | null;
}

export enum ERoomCreationStage {
    GETTING_STARTED = 'getting_started',
    SELECT_HOUSE = 'select_house',
    ROOM_DETAILS = 'room_details',
    CREATOR_DETAILS = 'creator_details',
    ROOM_SOCIALS = 'room_socials',
}

export interface IRoomDetails {
    name: string;
}

export interface ICreatorDetails {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface IRoomSocial {
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