// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { ERoomStage, IProposalCreation, IRoomStore } from './@types';
import { IRoom } from '~src/types/schema';
import { IListingProposal } from './@types';

const initialState: IRoomStore = {
	currentStage: ERoomStage.PROPOSALS,
	error: '',
	loading: false,
	proposalCreation: {
		description: '',
		discussion: '',
		end_date: null,
		is_vote_results_hide_before_voting_ends: false,
		preparation_period: null,
		start_date: null,
		tags: [],
		title: ''
	},
	proposals: [],
	room: null
};

// Interesting type here. It's a mapped type that takes the keys of IProposalCreation and returns an object with those keys as the key, and the value is an object with the key and value of the key in IProposalCreation. So it's like:
type IProposalCreationFieldPayload = {
    [K in keyof IProposalCreation]: {
      key: K;
      value: IProposalCreation[K];
    }
}[keyof IProposalCreation];

export const roomStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate room', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.room
			};
		});
	},
	initialState,
	name: 'room',
	reducers: {
		resetProposalCreation: (state) => {
			localStorage.removeItem('proposalCreation');
			state.proposalCreation = {
				description: '',
				discussion: '',
				end_date: null,
				is_vote_results_hide_before_voting_ends: false,
				preparation_period: null,
				start_date: null,
				tags: [],
				title: ''
			};
		},
		setCurrentStage: (state, action: PayloadAction<ERoomStage>) => {
			state.currentStage = action.payload;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
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
		setProposalCreation_Field: (state, action: PayloadAction<IProposalCreationFieldPayload>) => {
			const obj = action.payload;
			state.loading = false;
			if (obj) {
				const { key, value } = obj;
				switch (key) {
				case 'title':
				case 'description':
				case 'discussion':
					state.proposalCreation[key] = value as string;
					break;
				case 'tags':
					state.proposalCreation[key] = value as string[];
					break;
				case 'start_date':
				case 'end_date':
				case 'preparation_period':
					state.proposalCreation[key] = value as string | null;
					break;
				case 'is_vote_results_hide_before_voting_ends':
					state.proposalCreation[key] = value as boolean;
					break;
				default:
					break;
				}
			}
		},
		setProposals: (state, action: PayloadAction<IListingProposal[]>) => {
			const proposals = action.payload;
			if (proposals && Array.isArray(proposals)) {
				state.proposals = proposals;
			}
		},
		setRoom: (state, action: PayloadAction<IRoom |null>) => {
			state.room = action.payload;
		}
	}
});

export default roomStore.reducer;
const roomActions = roomStore.actions;
export {
	roomActions
};