// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { ERoomStage, IDiscussionCreation, IListingDiscussion, IProposalCreation, IRoomSettings, IRoomStore, IVotingSystemOption } from './@types';
import { IRoom } from '~src/types/schema';
import { IListingProposal } from './@types';
import { EVotingSystem } from '~src/types/enums';
import { MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM } from '~src/global/min_token';

const initialState: IRoomStore = {
	currentStage: ERoomStage.PROPOSALS,
	discussionCreation: {
		description: '',
		tags: [],
		title: ''
	},
	discussions: [],
	error: '',
	loading: false,
	proposalCreation: {
		description: '',
		discussion: '',
		end_date: null,
		is_vote_results_hide_before_voting_ends: false,
		start_date: null,
		tags: [],
		title: '',
		voting_system: EVotingSystem.SINGLE_CHOICE_VOTING,
		voting_system_options: [
			{
				value: ''
			}
		]
	},
	proposals: [],
	room: null,
	roomSettings: {
		min_token_to_create_proposal_in_room: MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM
	}
};

// Interesting type here. It's a mapped type that takes the keys of IProposalCreation and returns an object with those keys as the key, and the value is an object with the key and value of the key in IProposalCreation. So it's like:
type IProposalCreationFieldPayload = {
    [K in keyof IProposalCreation]: {
      key: K;
      value: IProposalCreation[K];
    }
}[keyof IProposalCreation];

type IDiscussionCreationFieldPayload = {
    [K in keyof IDiscussionCreation]: {
      key: K;
      value: IDiscussionCreation[K];
    }
}[keyof IDiscussionCreation];

type IRoomSettingsFieldPayload = {
    [K in keyof IRoomSettings]: {
      key: K;
      value: IRoomSettings[K];
    }
}[keyof IRoomSettings];

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
		resetDiscussionCreation: (state) => {
			localStorage.removeItem('discussionCreation');
			state.discussionCreation = {
				description: '',
				tags: [],
				title: ''
			};
		},
		resetProposalCreation: (state) => {
			localStorage.removeItem('proposalCreation');
			state.proposalCreation = {
				description: '',
				discussion: '',
				end_date: null,
				is_vote_results_hide_before_voting_ends: false,
				start_date: null,
				tags: [],
				title: '',
				voting_system: EVotingSystem.SINGLE_CHOICE_VOTING,
				voting_system_options: [
					{
						value: ''
					}
				]
			};
		},
		setCurrentStage: (state, action: PayloadAction<ERoomStage>) => {
			state.currentStage = action.payload;
		},
		setDiscussion: (state, action: PayloadAction<IListingDiscussion>) => {
			const discussion = action.payload;
			if (discussion) {
				if (state.discussions && Array.isArray(state.discussions)) {
					state.discussions = [...state.discussions, discussion];
				} else {
					state.discussions = [discussion];
				}
			}
		},
		setDiscussionCreation_Field: (state, action: PayloadAction<IDiscussionCreationFieldPayload>) => {
			const obj = action.payload;
			state.loading = false;
			if (obj) {
				const { key, value } = obj;
				switch (key) {
				case 'title':
				case 'description':
					state.discussionCreation[key] = value as string;
					break;
				case 'tags':
					state.discussionCreation[key] = value as string[];
					break;
				default:
					break;
				}
			}
		},
		setDiscussions: (state, action: PayloadAction<IListingDiscussion[]>) => {
			const discussions = action.payload;
			if (discussions && Array.isArray(discussions)) {
				state.discussions = discussions;
			}
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
					state.proposalCreation[key] = value as string | null;
					break;
				case 'is_vote_results_hide_before_voting_ends':
					state.proposalCreation[key] = value as boolean;
					break;
				case 'voting_system':
					state.proposalCreation[key] = value as EVotingSystem;
					break;
				case 'voting_system_options':
					state.proposalCreation[key] = value as IVotingSystemOption[];
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
			const room = action.payload;
			state.room = room;
			state.roomSettings = {
				min_token_to_create_proposal_in_room: (room?.min_token_to_create_proposal_in_room || room?.min_token_to_create_proposal_in_room === 0)? room?.min_token_to_create_proposal_in_room: MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM
			};
		},
		setRoomSettings_Field: (state, action: PayloadAction<IRoomSettingsFieldPayload>) => {
			const obj = action.payload;
			state.loading = false;
			if (obj) {
				const { key, value } = obj;
				switch (key) {
				case 'min_token_to_create_proposal_in_room':
					state.roomSettings[key] = value as number;
					break;
				default:
					break;
				}
			}
		}
	}
});

export default roomStore.reducer;
const roomActions = roomStore.actions;
export {
	roomActions
};