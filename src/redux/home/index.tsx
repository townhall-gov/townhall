// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IHomeStore } from './@types';
import { IHouse, IRoom } from '~src/types/schema';

const initialState: IHomeStore = {
	category: 'houses',
	error: null,
	houses: [],
	isLoadMoreVisible:true,
	loading: true,
	rooms: [],
	searchQuery: '',
	visibleAllCards: 10,
	visibleHouseCards: 10,
	visibleRoomCards: 10
};

export const homeStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate houses', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.houses
			};
		});
	},
	initialState,
	name: 'home',
	reducers: {
		setCategory: (state, action: PayloadAction<'houses' | 'rooms' | 'all'>) => {
			state.category = action.payload;
		},
		setHouses: (state, action: PayloadAction<IHouse[]>) => {
			state.houses = action.payload;
		},
		setLoadMoreAll: (state) => {
			state.visibleAllCards = state.visibleAllCards + 10;
		},
		setLoadMoreHouses: (state) => {
			state.visibleHouseCards = state.visibleHouseCards + 10;
		},
		setLoadMoreRooms: (state) => {
			state.visibleRoomCards = state.visibleRoomCards + 10;
		},
		setLoadMoreVisibility: (state,action: PayloadAction<boolean>) => {
			state.isLoadMoreVisible = action.payload ;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setRooms: (state, action: PayloadAction<IRoom[]>) => {
			state.rooms = action.payload;
		},
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
		}
	}
});

export default homeStore.reducer;
const homeActions = homeStore.actions;
export {
	homeActions
};