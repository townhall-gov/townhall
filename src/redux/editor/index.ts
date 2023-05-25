// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IEditorStore } from './@types';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: IEditorStore = {
	isClean: false
};

export const editorStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			return {
				...state,
				...(action as PayloadAction<any>).payload.notification
			};
		});
	},
	initialState,
	name: 'editor',
	reducers: {
		setIsClean: (state, action: PayloadAction<boolean>) => {
			state.isClean = action.payload;
		}
	}
});

export default editorStore.reducer;
const editorActions = editorStore.actions;
export {
	editorActions
};