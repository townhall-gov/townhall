// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { MIN_TOKEN_TO_CREATE_ROOM } from '~src/global/min_token';
import { IHouse, IRoom } from '~src/types/schema';
import { IHouseStore, EHouseStage, IHouseSettings, IListingProposal } from './@types';
import { IHouseRoom } from 'pages/api/house/rooms';

const initialState: IHouseStore = {
	currentStage: EHouseStage.PROPOSALS,
	error: '',
	house: null,
	houseDefaultRoom: null,
	houseRooms: [],
	houseSettings: {
		min_token_to_create_room: MIN_TOKEN_TO_CREATE_ROOM
	},
	loading: false,
	proposals: []
};

// Interesting type here. It's a mapped type that takes the keys of IProposalCreation and returns an object with those keys as the key, and the value is an object with the key and value of the key in IProposalCreation. So it's like:

type IHouseSettingsFieldPayload = {
    [K in keyof IHouseSettings]: {
      key: K;
      value: IHouseSettings[K];
    }
}[keyof IHouseSettings];

export const houseStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate House', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.house
			};
		});
	},
	initialState,
	name: 'house',
	reducers: {
		setCurrentStage: (state, action: PayloadAction<EHouseStage>) => {
			state.currentStage = action.payload;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
		},
		setHouse: (state, action: PayloadAction<IHouse |null>) => {
			const house = action.payload;
			state.house = house;
			state.houseSettings = {
				min_token_to_create_room: (house?.min_token_to_create_room || house?.min_token_to_create_room === 0)? house?.min_token_to_create_room: MIN_TOKEN_TO_CREATE_ROOM
			};
		},
		setHouseDefaultRoom: (state, action: PayloadAction<IRoom |null>) => {
			const room = action.payload;
			state.houseDefaultRoom = room;
		},
		setHouseRooms: (state, action: PayloadAction<IHouseRoom[] | null>) => {
			const houseRoom = action.payload;
			state.houseRooms = houseRoom;
		},
		setHouseSettings_Field: (state, action: PayloadAction<IHouseSettingsFieldPayload>) => {
			const obj = action.payload;
			state.loading = false;
			if (obj) {
				const { key, value } = obj;
				switch (key) {
				case 'min_token_to_create_room':
					state.houseSettings[key] = value as number;
					break;
				default:
					break;
				}
			}
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setProposal: (state, action: PayloadAction<IListingProposal>) => {
			const proposal = action.payload;
			if (proposal) {
				if (state.proposals && Array.isArray(state.proposals)) {
					state.proposals = [...state.proposals, proposal];
				} else {
					state.proposals = [proposal];
				}
			}
		},
		setProposals: (state, action: PayloadAction<IListingProposal[]>) => {
			const proposals = action.payload;
			if (proposals && Array.isArray(proposals)) {
				state.proposals = proposals;
			}
		}
	}
});

export default houseStore.reducer;
const houseActions = houseStore.actions;
export {
	houseActions
};