// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IWalletStore, TSelectedAddress } from './@types';
import { HYDRATE } from 'next-redux-wrapper';
import { EWallet } from '~src/types/enums';

const initialState: IWalletStore = {
	error: null,
	loading: false,
	selectedAddress: null,
	selectedWallet: null,
	walletsAddresses: {
		[EWallet.POLKADOT_JS]: [],
		[EWallet.METAMASK]: []
	}
};

export const walletStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate wallet', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.modal
			};
		});
	},
	initialState,
	name: 'wallet',
	reducers: {
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setSelectedAddress: (state, action: PayloadAction<TSelectedAddress>) => {
			state.selectedAddress = action.payload;
		},
		setSelectedWallet: (state, action: PayloadAction<EWallet>) => {
			state.selectedWallet = action.payload;
		},
		setWalletsAddresses: (state, action: PayloadAction<{
			[key in EWallet]?: string[];
		}>) => {
			state.walletsAddresses = {
				...state.walletsAddresses,
				...action.payload
			};
		}
	}
});

export default walletStore.reducer;
const walletActions = walletStore.actions;
export {
	walletActions
};