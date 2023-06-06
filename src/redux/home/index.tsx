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
	loading: false,
	rooms: [],
	searchQuery: '',
	visibleHouseCards:3,
	visibleRoomCards:3
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
		setCategory: (state, action: PayloadAction<string>) => {
			state.category = action.payload;
		},
		setHouses: (state, action: PayloadAction<IHouse[]>) => {
			state.houses = action.payload;
		},
		setLoadMoreHouses: (state) => {
			state.visibleHouseCards = state.visibleHouseCards+3;
		},
		setLoadMoreRooms: (state) => {
			state.visibleRoomCards = state.visibleRoomCards+3;
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