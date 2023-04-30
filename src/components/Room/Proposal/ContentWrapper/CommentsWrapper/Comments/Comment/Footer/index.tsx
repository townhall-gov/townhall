// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import SentimentIcon from '~src/ui-components/SentimentIcon';
import CommentReactions from './Reactions';
import CommentReply from './Reply';
import CommentOtherActionsDropdown from './Other';
import { IComment } from '~src/types/schema';

interface ICommentFooterProps {
	comment: IComment;
}

const CommentFooter: FC<ICommentFooterProps> = (props) => {
	const { comment } = props;
	if (!comment) return null;
	const { sentiment, id } = comment;
	return (
		<footer className='flex items-center gap-x-3'>
			{
				sentiment?
					<SentimentIcon
						type={sentiment}
						className='text-purple_primary text-[22px]'
					/>
					: null
			}
			<CommentReactions />
			<CommentReply />
			<CommentOtherActionsDropdown
				comment_id={id}
			/>
		</footer>
	);
};

export default CommentFooter;