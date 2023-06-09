// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IReaction, IReply } from '~src/types/schema';
import { useProposalSelector } from '../selectors';
import { EReaction } from '~src/types/enums';

const useUserReaction = (address: string) => {
	const { proposal } = useProposalSelector();
	let userReaction: IReaction | undefined;
	if (proposal && proposal.reactions && Array.isArray(proposal.reactions)) {
		userReaction = proposal.reactions.find((reaction) => {
			if (reaction.user_address === address) {
				return reaction;
			}
		});
	}
	return userReaction?.type;
};

const useReplyComment = () => {
	const { replyComment } = useProposalSelector();
	return replyComment;
};

const useRepliesVisibility = () => {
	const { isRepliesVisible } = useProposalSelector();
	return isRepliesVisible;
};

const useReactions = (type: EReaction) => {
	const reactions: IReaction[] = [];
	const { proposal } = useProposalSelector();
	if (proposal && proposal.reactions && Array.isArray(proposal.reactions)) {
		proposal.reactions.forEach((reaction) => {
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
	const proposal = useProposalSelector();
	return proposal.commentCreation;
};

const useReplyCreation = () => {
	const proposal = useProposalSelector();
	return proposal.replyCreation;
};

const useSelectedComments = (select: number) => {
	const { proposal, isAllCommentsVisible } = useProposalSelector();
	if (!proposal || !proposal.comments || !Array.isArray(proposal.comments)) return {
		comments: [],
		total: 0
	};
	if (isAllCommentsVisible) {
		return {
			comments: proposal.comments,
			total: proposal.comments.length
		};
	} else {
		return {
			comments: proposal.comments.slice(0, select),
			total: proposal.comments.length
		};
	}
};

const useSelectedReplies = (select: number,replies:IReply[]|null) => {
	const { proposal, isAllRepliesVisible } = useProposalSelector();
	if(!proposal || !replies || !Array.isArray(replies))
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
	const { commentEditHistory } = useProposalSelector();
	return [...commentEditHistory];
};

const useReplyEditHistory = () => {
	const { replyEditHistory } = useProposalSelector();
	return [...replyEditHistory];
};

const usePostLink = () => {
	const { proposal } = useProposalSelector();
	return proposal?.post_link;
};

const usePostLinkCreation = () => {
	const { postLinkCreation } = useProposalSelector();
	return postLinkCreation;
};

export {
	useCommentCreation,
	useUserReaction,
	useReactions,
	useSelectedReplies,
	useSelectedComments,
	useReplyCreation,
	useReplyEditHistory,
	useCommentEditHistory,
	useCommentUserReaction,
	useCommentReactions,
	useReplyComment,
	useRepliesVisibility,
	usePostLink,
	usePostLinkCreation
};