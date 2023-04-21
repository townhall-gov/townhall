// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IProfileStore } from './@types';
import { IUser } from '~src/types/schema';

const initialState: IProfileStore = {
	user: null
};

export const profileStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate profile', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.modal
			};
		});
	},
	initialState,
	name: 'profile',
	reducers: {
		setUser: (state, action: PayloadAction<IUser | null>) => {
			state.user = action.payload;
		}
	}
});

export default profileStore.reducer;
const profileActions = profileStore.actions;
export {
	profileActions
};