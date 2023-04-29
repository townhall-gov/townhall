// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IProposalStore } from './@types';
import { IProposal, IReaction } from '~src/types/schema';

const initialState: IProposalStore = {
	error: null,
	loading: false,
	proposal: null
};

export const proposalStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate proposal', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.proposal
			};
		});
	},
	initialState,
	name: 'proposal',
	reducers: {
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setProposal: (state, action: PayloadAction<IProposal>) => {
			state.proposal = action.payload;
		},
		setReaction: (state, action: PayloadAction<{
			reaction: IReaction;
			isDeleted: boolean;
		}>) => {
			const { reaction, isDeleted } = action.payload;
			if (state?.proposal?.reactions && Array.isArray(state.proposal.reactions)) {
				const index = state.proposal.reactions.findIndex((r) => r.id === reaction.id);
				if (index > -1) {
					if (isDeleted) {
						state.proposal.reactions.splice(index, 1);
					} else {
						state.proposal.reactions[index] = reaction;
					}
				} else {
					state.proposal.reactions.push(reaction);
				}
			}
		}
	}
});

export default proposalStore.reducer;
const proposalActions = proposalStore.actions;
export {
	proposalActions
};