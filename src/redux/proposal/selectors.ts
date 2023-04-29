// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IReaction } from '~src/types/schema';
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

const useCommentCreation = () => {
	const proposal = useProposalSelector();
	return proposal.commentCreation;
};

export {
	useCommentCreation,
	useUserReaction,
	useReactions
};