// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { ICommentCreation, IDiscussionStore } from './@types';
import { IComment, IDiscussion, IHistoryComment, IReaction } from '~src/types/schema';
import { EAction, ESentiment } from '~src/types/enums';

const initialState: IDiscussionStore = {
	commentCreation: {
		comment_open:false,
		content: '',
		sentiment: ESentiment.NEUTRAL
	},
	commentEditHistory: [],
	discussion: null,
	editableComment: null,
	error: null,
	isAllCommentsVisible: false,
	loading: false
};

type ICommentCreationFieldPayload = {
    [K in keyof ICommentCreation]: {
      key: K;
      value: ICommentCreation[K];
    }
}[keyof ICommentCreation];

export const discussionStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate discussion', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.discussion
			};
		});
	},
	initialState,
	name: 'discussion',
	reducers: {
		resetCommentCreation: (state) => {
			const discussion = state.discussion;
			if (discussion) {
				localStorage.removeItem(`house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}_comment`);
			}
			state.commentCreation = {
				comment_open: false,
				content: '',
				sentiment: ESentiment.NEUTRAL
			};
		},
		resetEditableComment: (state) => {
			localStorage.removeItem('commentEdit');
			state.editableComment = null;
		},
		setCommentCreation_Field: (state, action: PayloadAction<ICommentCreationFieldPayload>) => {
			const obj = action.payload;
			if (obj) {
				const { key, value } = obj;
				switch(key) {
				case 'content':
					state.commentCreation.content = value;
					break;
				case 'sentiment':
					state.commentCreation.sentiment = value;
				}
			}
		},
		setCommentEditHistory: (state, action: PayloadAction<IHistoryComment[]>) => {
			state.commentEditHistory = action.payload;
		},
		setCommentOpen: (state, action: PayloadAction<boolean>) => {
			state.commentCreation.comment_open = action.payload;
		},
		setCommentReaction: (state, action: PayloadAction<{
			reaction: IReaction;
			isDeleted: boolean;
			comment_id: string;
		}>) => {
			const { reaction, isDeleted, comment_id } = action.payload;
			if (state?.discussion?.comments && Array.isArray(state.discussion.comments)) {
				const comment = state.discussion.comments.find((c) => c.id === comment_id);
				if (comment && comment.reactions && Array.isArray(comment.reactions)) {
					state.discussion.comments = state.discussion.comments.map((comment) => {
						if (comment.id === comment_id) {
							const index = comment.reactions.findIndex((r) => r.id === reaction.id);
							if (index > -1) {
								if (isDeleted) {
									comment.reactions.splice(index, 1);
								} else {
									comment.reactions[index] = reaction;
								}
							} else {
								comment.reactions.push(reaction);
							}
						}
						return {
							...comment
						};
					});
				}
			}
		},
		setDiscussion: (state, action: PayloadAction<IDiscussion>) => {
			state.discussion = action.payload;
		},
		setEditableComment: (state, action: PayloadAction<IComment | null>) => {
			state.editableComment = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setIsAllCommentsVisible: (state, action: PayloadAction<boolean>) => {
			state.isAllCommentsVisible = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setReaction: (state, action: PayloadAction<{
			reaction: IReaction;
			isDeleted: boolean;
		}>) => {
			const { reaction, isDeleted } = action.payload;
			if (state?.discussion?.reactions && Array.isArray(state.discussion.reactions)) {
				const index = state.discussion.reactions.findIndex((r) => r.id === reaction.id);
				if (index > -1) {
					if (isDeleted) {
						state.discussion.reactions.splice(index, 1);
					} else {
						state.discussion.reactions[index] = reaction;
					}
				} else {
					state.discussion.reactions.push(reaction);
				}
			}
		},
		updateComments: (state, action: PayloadAction<{
			comment: IComment;
			action_type: EAction;
		}>) => {
			const { comment, action_type } = action.payload;
			if (state?.discussion?.comments && Array.isArray(state.discussion.comments)) {
				const index = state.discussion.comments.findIndex((r) => r.id === comment.id);
				if (index > -1) {
					if (action_type === EAction.DELETE) {
						state.discussion.comments.splice(index, 1);
					} else if (action_type === EAction.EDIT) {
						let url = window.location.href;
						const matches = window.location.href.match(/discussion\/\w+#.*/);
						if (matches && matches.length > 0) {
							url = window.location.href?.replace(/#.*/, '');
						}
						window.history.replaceState(null, null!, url + '#' + comment.id);
						state.discussion.comments.splice(index, 1);
						state.discussion.comments.unshift(comment);
					}
				} else {
					if (action_type === EAction.ADD) {
						let url = window.location.href;
						const matches = window.location.href.match(/discussion\/\w+#.*/);
						if (matches && matches.length > 0) {
							url = window.location.href?.replace(/#.*/, '');
						}
						window.history.replaceState(null, null!, url + '#' + comment.id);
						state.discussion.comments.unshift(comment);
					}
				}
			}
		}
	}
});

export default discussionStore.reducer;
const discussionActions = discussionStore.actions;
export {
	discussionActions
};