// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IReaction, IReply } from '~src/types/schema';
import { useDiscussionSelector } from '../selectors';
import { EReaction } from '~src/types/enums';

const useUserReaction = (address: string) => {
	const { discussion } = useDiscussionSelector();
	let userReaction: IReaction | undefined;
	if (discussion && discussion.reactions && Array.isArray(discussion.reactions)) {
		userReaction = discussion.reactions.find((reaction) => {
			if (reaction.user_address === address) {
				return reaction;
			}
		});
	}
	return userReaction?.type;
};

const useReplyComment = () => {
	const { replyComment } = useDiscussionSelector();
	return replyComment;
};

const useReactions = (type: EReaction) => {
	const reactions: IReaction[] = [];
	const { discussion } = useDiscussionSelector();
	if (discussion && discussion.reactions && Array.isArray(discussion.reactions)) {
		discussion.reactions.forEach((reaction) => {
			if (reaction.type === type) {
				reactions.push(reaction);
			}
		});
	}
	return reactions;
};

const useCommentUserReaction = (reactions: IReaction[], address: string) => {
	let userReaction: IReaction | undefined;
	if (reactions && Array.isArray(reactions)) {
		userReaction = reactions.find((reaction) => {
			if (reaction.user_address === address) {
				return reaction;
			}
		});
	}
	return userReaction?.type;
};

const useCommentReactions = (reactions: IReaction[], type: EReaction) => {
	const newReactions: IReaction[] = [];
	if (reactions && Array.isArray(reactions)) {
		reactions.forEach((reaction) => {
			if (reaction.type === type) {
				newReactions.push(reaction);
			}
		});
	}
	return newReactions;
};

const useCommentCreation = () => {
	const discussion = useDiscussionSelector();
	return discussion.commentCreation;
};

const useReplyCreation = () => {
	const discussion = useDiscussionSelector();
	return discussion.replyCreation;
};

const useSelectedComments = (select: number) => {
	const { discussion, isAllCommentsVisible } = useDiscussionSelector();
	if (!discussion || !discussion.comments || !Array.isArray(discussion.comments)) return {
		comments: [],
		total: 0
	};
	if (isAllCommentsVisible) {
		return {
			comments: discussion.comments,
			total: discussion.comments.length
		};
	} else {
		return {
			comments: discussion.comments.slice(0, select),
			total: discussion.comments.length
		};
	}
};

const useSelectedReplies = (select: number,replies: IReply[] | null) => {
	const { discussion, isAllRepliesVisible } = useDiscussionSelector();
	if(!discussion || !replies || !Array.isArray(replies))
		return{
			replies:[],
			total:0
		};
	if (isAllRepliesVisible) {
		return {
			selectedReplies: replies,
			total: replies?.length
		};
	} else {
		return {
			selectedReplies: replies?.slice(0,select),
			total: replies?.length
		};
	}
};

const useCommentEditHistory = () => {
	const { commentEditHistory } = useDiscussionSelector();
	return [...commentEditHistory];
};

const useReplyEditHistory = () => {
	const { replyEditHistory } = useDiscussionSelector();
	return [...replyEditHistory];
};

const useEditableDiscussion = () => {
	const { editableDiscussion } = useDiscussionSelector();
	return editableDiscussion;
};

export {
	useCommentCreation,
	useUserReaction,
	useReactions,
	useSelectedComments,
	useCommentEditHistory,
	useCommentUserReaction,
	useCommentReactions,
	useReplyComment,
	useReplyEditHistory,
	useReplyCreation,
	useSelectedReplies,
	useEditableDiscussion
};