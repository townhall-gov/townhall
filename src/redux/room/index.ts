// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { ERoomStage, IDiscussionCreation, IListingDiscussion, IProposalCreation, IRoomSettings, IRoomStore, IVotingSystemOption } from './@types';
import { IPostLink, IRoom } from '~src/types/schema';
import { IListingProposal } from './@types';
import { EVotingSystem } from '~src/types/enums';
import { IPostLinkData } from 'pages/api/auth/data/post-link-data';
import { IStrategy } from '../rooms/@types';
import { assetChains } from '~src/onchain-data/networkConstants';
import { TTokenMetadata } from '~src/onchain-data/token-meta/getTokensMetadata';

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
		postLink: null,
		postLinkData: null,
		start_date: null,
		tags: [],
		title: '',
		url: '',
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
		room_strategies: [],
		room_strategies_threshold:[]
	},
	selectedStrategyThresholdTobeEdited:null,
	selectedStrategyTobeEdited:null,
	strategyIdTobeDeleted:'',
	strategyThresholdIdTobeDeleted:'',
	tokensMetadata: {}
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
				postLink: null,
				postLinkData: null,
				start_date: null,
				tags: [],
				title: '',
				url: '',
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
				case 'url':
					state.proposalCreation[key] = value as string;
					break;
				case 'postLink':
					state.proposalCreation[key] = value as IPostLink;
					break;
				case 'postLinkData':
					state.proposalCreation[key] = value as IPostLinkData;
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
				room_strategies: room?.voting_strategies || [],
				room_strategies_threshold:[]
			};
		},
		setRoomSettingsStrategiesAdd: (state, action: PayloadAction<IStrategy>) => {
			const strategy = action.payload;
			state.roomSettings.room_strategies = [...state.roomSettings.room_strategies, strategy];
		},
		setRoomSettingsStrategiesDelete: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			const index = state.roomSettings.room_strategies.findIndex((item) => {
				return item.id === id;
			});
			if (index >= 0) {
				state.roomSettings.room_strategies.splice(index, 1);
			}
		},
		setRoomSettingsStrategiesEdit: (state, action: PayloadAction<IStrategy>) => {
			const strategy = action.payload;
			state.selectedStrategyTobeEdited=strategy;
		},
		setRoomSettingsStrategiesThresholdAdd: (state, action: PayloadAction<IStrategy>) => {
			const strategyThreshold = action.payload;
			state.roomSettings.room_strategies_threshold = [...state.roomSettings.room_strategies_threshold, strategyThreshold];
		},
		setRoomSettingsStrategyEditedObject: (state, action: PayloadAction<IStrategy>) => {
			const strategy = action.payload;
			state.roomSettings.room_strategies = state.roomSettings.room_strategies.map((item) => {
				if (item.id === strategy.id) {
					return strategy;
				}
				return item;
			});
		},
		setRoomSettingsStrategyIdDeleted: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			state.strategyIdTobeDeleted = id;
		},
		setRoomSettingsStrategyObjectForEdit: (state, action: PayloadAction<IStrategy>) => {
			const strategy = action.payload;
			state.selectedStrategyTobeEdited = strategy;
		},
		setRoomSettingsStrategyThresholdEditedObject: (state, action: PayloadAction<IStrategy>) => {
			const strategy = action.payload;
			state.roomSettings.room_strategies_threshold = state.roomSettings.room_strategies_threshold.map((item) => {
				if (item.id === strategy.id) {
					return strategy;
				}
				return item;
			});
		},
		setRoomSettingsStrategyThresholdIdDeleted: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			state.strategyThresholdIdTobeDeleted = id;
		},
		setRoomSettingsStrategyThresholdObjectForEdit: (state, action: PayloadAction<IStrategy>) => {
			const strategyThreshold = action.payload;
			state.selectedStrategyThresholdTobeEdited = strategyThreshold;
		},
		setRoomSettingsStrategyThresoldDelete: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			const index = state.roomSettings.room_strategies_threshold.findIndex((item) => {
				return item.id === id;
			});
			if (index >= 0) {
				state.roomSettings.room_strategies_threshold.splice(index, 1);
			}
		},
		setRoomSettings_Field: (state, action: PayloadAction<IRoomSettingsFieldPayload>) => {
			const obj = action.payload;
			state.loading = false;
			if (obj) {
				const { key, value } = obj;
				switch (key) {
				case 'room_strategies':
					state.roomSettings[key] = value as IStrategy[];
					break;
				default:
					break;
				}
			}
		},
		setTokensMetadata: (state, action: PayloadAction<{
			key: keyof typeof assetChains;
			value: TTokenMetadata[];
		}>) => {
			const obj = action.payload;
			if (!state.tokensMetadata) {
				state.tokensMetadata = {};
			}
			state.tokensMetadata[obj.key] = obj.value;
		}
	}
});

export default roomStore.reducer;
const roomActions = roomStore.actions;
export {
	roomActions
};