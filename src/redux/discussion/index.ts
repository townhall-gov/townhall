// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { EEditableDiscussionAction, ICommentCreation, IDiscussionStore, TEditableDiscussion } from './@types';
import { IComment, IDiscussion, IHistoryComment, IHistoryReply, IReaction, IReply } from '~src/types/schema';
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
	editableDiscussion: {
		action: EEditableDiscussionAction.EDIT_DISCUSSION,
		description: '',
		tags: [],
		title: ''
	},
	editableReply: null,
	error: null,
	isAllCommentsVisible: false,
	isAllRepliesVisible: false,
	isRepliesVisible:{
		replies_comment_id:'',
		replies_isVisible:false
	},
	loading: false,
	replyComment: null,
	replyCreation: {
		comment_open:false,
		content: '',
		sentiment: ESentiment.NEUTRAL
	},
	replyEditHistory: []
};

type ICommentCreationFieldPayload = {
    [K in keyof ICommentCreation]: {
      key: K;
      value: ICommentCreation[K];
    }
}[keyof ICommentCreation];

type TEditableDiscussionFieldPayload = {
    [K in keyof TEditableDiscussion]: {
      key: K;
      value: TEditableDiscussion[K];
    }
}[keyof TEditableDiscussion];

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
			const discussion = state.discussion;
			const comment = state.editableComment;
			const key = `house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}_comment_${comment?.id}`;
			localStorage.removeItem(key);
			state.editableComment = null;
		},
		resetEditableDiscussion: (state) => {
			const discussion = state.discussion;
			const key = `house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}`;
			localStorage.removeItem(key);
			state.editableDiscussion = {
				action: EEditableDiscussionAction.EDIT_DISCUSSION,
				description: '',
				tags: [],
				title: ''
			};
		},
		resetEditableReply: (state) => {
			const discussion = state.discussion;
			const reply = state.editableReply;
			const key = `house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}_comment_${reply?.comment_id}_reply_${reply?.id}`;
			localStorage.removeItem(key);
			state.editableReply = null;
		},
		resetReplyCreation: (state) => {
			const discussion = state.discussion;
			const replyComment = state.replyComment;
			if (discussion && replyComment) {
				localStorage.removeItem(`house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}_comment_${replyComment.id}_reply`);
			}
			state.replyCreation = {
				comment_open: false,
				content: '',
				sentiment: ESentiment.NEUTRAL
			};
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
		setEditableDiscussion: (state, action: PayloadAction<TEditableDiscussion>) => {
			state.editableDiscussion = action.payload;
		},
		setEditableDiscussion_Field: (state, action: PayloadAction<TEditableDiscussionFieldPayload>) => {
			const obj = action.payload;
			if (obj) {
				const { key, value } = obj;
				switch(key) {
				case 'action':
					state.editableDiscussion.action = value;
					break;
				case 'description':
					state.editableDiscussion.description = value;
					break;
				case 'title':
					state.editableDiscussion.title = value;
					break;
				case 'tags':
					state.editableDiscussion.tags = value;
				}
			}
		},
		setEditableReply: (state, action: PayloadAction<IReply | null>) => {
			state.editableReply = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setIsAllCommentsVisible: (state, action: PayloadAction<boolean>) => {
			state.isAllCommentsVisible = action.payload;
		},
		setIsAllRepliesVisible: (state, action: PayloadAction<boolean>) => {
			state.isAllRepliesVisible = action.payload;
		},
		setIsRepliesVisible: (state, action: PayloadAction<{
			replies_comment_id: string;
			replies_isVisible: boolean;
		}>) => {
			const { replies_comment_id,replies_isVisible } = action.payload;
			state.isRepliesVisible.replies_comment_id=replies_comment_id;
			state.isRepliesVisible.replies_isVisible=replies_isVisible;
			state.replyComment = null;
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
		setReplyComment: (state, action: PayloadAction<IComment | null>) => {
			const replyComment = action.payload;
			state.replyComment = replyComment;
		},
		setReplyCreation_Field: (state, action: PayloadAction<ICommentCreationFieldPayload>) => {
			const obj = action.payload;
			if (obj) {
				const { key, value } = obj;
				switch(key) {
				case 'content':
					state.replyCreation.content = value;
					break;
				case 'sentiment':
					state.replyCreation.sentiment = value;
				}
			}
		},
		setReplyEditHistory: (state, action: PayloadAction<IHistoryReply[]>) => {
			state.replyEditHistory = action.payload;
		},
		setReplyOpen: (state, action: PayloadAction<boolean>) => {
			state.replyCreation.comment_open = action.payload;
		},
		setReplyReaction: (state, action: PayloadAction<{
			reaction: IReaction;
			isDeleted: boolean;
			reply_id:string;
			comment_id:string;
		}>) => {
			const { reaction, isDeleted , comment_id,reply_id } = action.payload;
			let repliesArr = state?.discussion?.comments.find((comment) => comment.id === comment_id)?.replies;
			if (repliesArr && Array.isArray(repliesArr)) {
				const reply = repliesArr.find((c) => c.id === reply_id);
				if (reply && reply.reactions && Array.isArray(reply.reactions)) {
					repliesArr = repliesArr.map((reply) => {
						if (reply.id === reply_id) {
							const index = reply.reactions.findIndex((r) => r.id === reaction.id);
							if (index > -1) {
								if (isDeleted) {
									reply.reactions.splice(index, 1);
								} else {
									reply.reactions[index] = reaction;
								}
							} else {
								reply.reactions.push(reaction);
							}
						}
						return {
							...reply
						};
					});
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
		},
		updateReplies: (state, action: PayloadAction<{
			reply: IReply;
			action_type: EAction;
		}>) => {
			const { reply, action_type } = action.payload;
			const repliesArr = state?.discussion?.comments.find((comment) => comment.id === reply.comment_id)?.replies;
			if (repliesArr && Array.isArray(repliesArr)) {
				const index = repliesArr.findIndex((r) => r.id === reply.id);
				if (index > -1) {
					if (action_type === EAction.DELETE) {
						repliesArr.splice(index, 1);
					} else if (action_type === EAction.EDIT) {
						repliesArr.splice(index, 1);
						repliesArr.unshift(reply);
					}
				} else {
					if (action_type === EAction.ADD) {
						repliesArr.unshift(reply);
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