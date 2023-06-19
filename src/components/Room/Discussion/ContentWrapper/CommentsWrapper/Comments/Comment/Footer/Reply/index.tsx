// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import classNames from 'classnames';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { discussionActions } from '~src/redux/discussion';
import { useReplyBoxVisibility } from '~src/redux/discussion/selectors';
import { useProposalSelector } from '~src/redux/selectors';
import { ReplyIcon } from '~src/ui-components/CustomIcons';

interface ICommentReplyProps {
	comment_id: string;
}

const CommentReply: FC<ICommentReplyProps> = (props) => {
	const { comment_id } = props;
	const { loading } = useProposalSelector();
	const { replyBox_isVisible } = useReplyBoxVisibility();
	const dispatch = useDispatch();
	return (
		<div>
			<button
				disabled={loading}
				className={classNames('outline-none border-none bg-transparent flex items-center gap-x-1 text-blue_primary text-xs leading-[22px] font-normal', {
					'cursor-not-allowed': loading,
					'cursor-pointer': !loading
				})}
				onClick={() => {
					dispatch(
						discussionActions.setIsReplyBoxVisible({
							replyBox_comment_id: comment_id,
							replyBox_isVisible: !replyBox_isVisible
						})
					);
				}}
			>
				<ReplyIcon />
				<span>Reply</span>
			</button>
		</div>
	);
};

export default CommentReply;