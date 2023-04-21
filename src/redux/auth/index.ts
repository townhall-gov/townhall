// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IAuthStore } from './@types';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: IAuthStore = {};

export const authStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate auth', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.modal
			};
		});
	},
	initialState,
	name: 'auth',
	reducers: {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		setToken: (_, action: PayloadAction<string>) => {}
	}
});

export default authStore.reducer;
const authActions = authStore.actions;
export {
	authActions
};