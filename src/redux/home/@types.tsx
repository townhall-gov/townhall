// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IHouse, IRoom } from '~src/types/schema';

export interface IHomeStore {
    houses: IHouse[];
    rooms: IRoom[];
    category: 'all' | 'houses' | 'rooms';
    loading: boolean;
    error: string | null;
    searchQuery: string;
    isLoadMoreVisible:boolean,
    visibleAllCards:number,
    visibleHouseCards:number,
    visibleRoomCards:number,
}