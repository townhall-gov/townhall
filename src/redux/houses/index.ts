// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IHousesStore } from './@types';
import { IHouse } from '~src/types/schema';

const initialState: IHousesStore = {
	error: null,
	houses: [],
	loading: false
};

export const housesStore = createSlice({
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
	name: 'houses',
	reducers: {
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setHouses: (state, action: PayloadAction<IHouse[]>) => {
			state.houses = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		}
	}
});

export default housesStore.reducer;
const housesActions = housesStore.actions;
export {
	housesActions
};