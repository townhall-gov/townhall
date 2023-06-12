// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { ICommentCreation, IProposalStore, IVoteCreation } from './@types';
import { IComment, IHistoryComment, IHistoryReply, IProposal, IReaction, IReply, IVote } from '~src/types/schema';
import { EAction, ESentiment } from '~src/types/enums';

const initialState: IProposalStore = {
	commentCreation: {
		content: '',
		sentiment: ESentiment.NEUTRAL
	},
	commentEditHistory: [],
	editableComment: null,
	editableReply: null,
	error: null,
	isAllCommentsVisible: false,
	isAllRepliesVisible: false,
	isReplyVisible:{
		comment_id:'',
		isVisible:false
	},
	loading: false,
	proposal: null,
	replyCreation:{
		content: '',
		sentiment: ESentiment.NEUTRAL
	},
	replyEditHistory: [],
	vote: null,
	voteCreation: {
		balances: [],
		options: []
	},
	votes: []
};

type ICommentCreationFieldPayload = {
    [K in keyof ICommentCreation]: {
      key: K;
      value: ICommentCreation[K];
    }
}[keyof ICommentCreation];

type IVoteCreationFieldPayload = {
    [K in keyof IVoteCreation]: {
      key: K;
      value: IVoteCreation[K];
    }
}[keyof IVoteCreation];

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
		resetCommentCreation: (state) => {
			const proposal = state.proposal;
			if (proposal) {
				localStorage.removeItem(`house_${proposal?.house_id}_room_${proposal?.room_id}_proposal_${proposal?.id}_comment`);
			}
			state.commentCreation = {
				content: '',
				sentiment: ESentiment.NEUTRAL
			};
		},
		resetEditableComment: (state) => {
			localStorage.removeItem('commentEdit');
			state.editableComment = null;
		},
		resetEditableReply: (state) => {
			localStorage.removeItem('replyEdit');
			state.editableReply = null;
		},
		resetVoteCreation: (state) => {
			state.voteCreation = {
				balances: [],
				note: '',
				options: []
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

		setCommentReaction: (state, action: PayloadAction<{
			reaction: IReaction;
			isDeleted: boolean;
			comment_id: string;
		}>) => {
			const { reaction, isDeleted, comment_id } = action.payload;
			if (state?.proposal?.comments && Array.isArray(state.proposal.comments)) {
				const comment = state.proposal.comments.find((c) => c.id === comment_id);
				if (comment && comment.reactions && Array.isArray(comment.reactions)) {
					state.proposal.comments = state.proposal.comments.map((comment) => {
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
		setEditableComment: (state, action: PayloadAction<IComment | null>) => {
			state.editableComment = action.payload;
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
		setIsReplyVisible: (state, action: PayloadAction<{
			comment_id: string;
			isVisible: boolean;
		}>) => {
			const { comment_id,isVisible }=action.payload;
			state.isReplyVisible.comment_id=comment_id;
			state.isReplyVisible.isVisible=isVisible;
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
		setReplyReaction: (state, action: PayloadAction<{
			reaction: IReaction;
			isDeleted: boolean;
			reply_id:string;
			comment_id:string;
		}>) => {
			const { reaction, isDeleted , comment_id,reply_id } = action.payload;
			let repliesArr = state?.proposal?.comments.find((comment) => comment.id === comment_id)?.replies;
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
		setVote: (state, action: PayloadAction<IVote>) => {
			const vote = action.payload;
			state.vote = vote;
		},
		setVoteCreation_Field: (state, action: PayloadAction<IVoteCreationFieldPayload>) => {
			const obj = action.payload;
			if (obj) {
				const { key, value } = obj;
				switch(key) {
				case 'balances':
					state.voteCreation.balances = value;
					break;
				case 'options':
					state.voteCreation.options = value;
				}
			}
		},
		setVotes: (state, action: PayloadAction<IVote[]>) => {
			const votes = action.payload;
			state.votes = votes;
		},
		updateComments: (state, action: PayloadAction<{
			comment: IComment;
			action_type: EAction;
		}>) => {
			const { comment, action_type } = action.payload;
			if (state?.proposal?.comments && Array.isArray(state.proposal.comments)) {
				const index = state.proposal.comments.findIndex((r) => r.id === comment.id);
				if (index > -1) {
					if (action_type === EAction.DELETE) {
						state.proposal.comments.splice(index, 1);
					} else if (action_type === EAction.EDIT) {
						let url = window.location.href;
						const matches = window.location.href.match(/proposal\/\w+#.*/);
						if (matches && matches.length > 0) {
							url = window.location.href?.replace(/#.*/, '');
						}
						window.history.replaceState(null, null!, url + '#' + comment.id);
						state.proposal.comments.splice(index, 1);
						state.proposal.comments.unshift(comment);
					}
				} else {
					if (action_type === EAction.ADD) {
						let url = window.location.href;
						const matches = window.location.href.match(/proposal\/\w+#.*/);
						if (matches && matches.length > 0) {
							url = window.location.href?.replace(/#.*/, '');
						}
						window.history.replaceState(null, null!, url + '#' + comment.id);
						state.proposal.comments.unshift(comment);
					}
				}
			}
		},
		updateReplies: (state, action: PayloadAction<{
			reply: IReply;
			action_type: EAction;
		}>) => {
			const { reply, action_type } = action.payload;
			const repliesArr = state?.proposal?.comments.find((comment) => comment.id === reply.comment_id)?.replies;
			if (repliesArr && Array.isArray(repliesArr)) {
				const index = repliesArr.findIndex((r) => r.id === reply.id);
				if (index > -1) {
					if (action_type === EAction.DELETE) {
						repliesArr.splice(index, 1);
					} else if (action_type === EAction.EDIT) {
						let url = window.location.href;
						const matches = window.location.href.match(/proposal\/\w+#.*/);
						if (matches && matches.length > 0) {
							url = window.location.href?.replace(/#.*/, '');
						}
						window.history.replaceState(null, null!, url + '#' + reply.comment_id + reply.id);
						repliesArr.splice(index, 1);
						repliesArr.unshift(reply);
					}
				} else {
					if (action_type === EAction.ADD) {
						let url = window.location.href;
						const matches = window.location.href.match(/proposal\/\w+#.*/);
						if (matches && matches.length > 0) {
							url = window.location.href?.replace(/#.*/, '');
						}
						window.history.replaceState(null, null!,url + '#' + reply.comment_id + reply.id);
						repliesArr.unshift(reply);
					}
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