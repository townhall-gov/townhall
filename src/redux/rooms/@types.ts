// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EVotingStrategy } from '~src/types/enums';
import { IHouse, IRoom } from '~src/types/schema';

export interface IRoomsStore {
    loading: boolean;
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
    room_strategies: IStrategy[];
    creator_details: Omit<ICreatorDetails, 'address'> | null;
    room_socials: IRoomSocial[] | null;
}

export enum ERoomCreationStage {
    GETTING_STARTED = 'getting_started',
    SELECT_HOUSE = 'select_house',
    ROOM_DETAILS = 'room_details',
    ROOM_STRATEGIES = 'room_strategies',
    CREATOR_DETAILS = 'creator_details',
    ROOM_SOCIALS = 'room_socials',
}

export interface IRoomDetails {
    name: string;
    contract_address: string;
    title: string;
    description: string;
    logo: string;
}

export interface IStrategy {
    name: EVotingStrategy;
    network: string;
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