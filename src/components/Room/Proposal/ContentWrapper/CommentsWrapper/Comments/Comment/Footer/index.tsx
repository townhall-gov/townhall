// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import CommentReactions from './Reactions';
import CommentReply from './Reply';
import CommentOtherActionsDropdown from './Other';
import { IComment } from '~src/types/schema';
import Sentiment from './Sentiment';

interface ICommentFooterProps {
	comment: IComment;
}

const CommentFooter: FC<ICommentFooterProps> = (props) => {
	const { comment } = props;
	if (!comment) return null;
	const { sentiment, id, reactions } = comment;
	return (
		<>
			<footer className='flex items-center gap-x-3'>
				<Sentiment sentiment={sentiment} />
				<CommentReactions comment_id={id} reactions={reactions} />
				<CommentReply comment_id={id}/>
				<CommentOtherActionsDropdown comment={comment} />
			</footer>
		</>

	);
};

export default CommentFooter;