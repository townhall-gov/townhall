// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useEffect } from 'react';
import { IComment } from '~src/types/schema';
import Comment from './Comment';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';

interface ICommentsProps {
	comments: IComment[];
	isAllCommentsVisible: boolean;
}

const Comments: FC<ICommentsProps> = (props) => {
	const { comments, isAllCommentsVisible } = props;
	const dispatch = useDispatch();
	useEffect(() => {
		if (typeof window == 'undefined') return;
		if (window.location.hash) {
			const hash = window.location.hash.replace('#', '');
			const comment = comments.find((comment) => comment.id === hash);
			if (comment && !isAllCommentsVisible) {
				dispatch(proposalActions.setIsAllCommentsVisible(true));
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [comments]);
	return (
		<section className='text-white mt-5 flex flex-col gap-y-6'>
			{
				comments.map((comment, index) => {
					return (
						<Comment
							key={`${comment.id} + ${index}`}
							comment={comment}
						/>
					);
				})
			}
		</section>
	);
};

export default Comments;