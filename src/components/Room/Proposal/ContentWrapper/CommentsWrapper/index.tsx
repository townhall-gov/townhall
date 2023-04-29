// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useProposalSelector } from '~src/redux/selectors';
import CreateComment from './CreateComment';
import Comments from './Comments';

const CommentsWrapper = () => {
	const { proposal } = useProposalSelector();
	if (!proposal) return null;
	const comments = proposal.comments;
	return (
		<div className='flex flex-col gap-y-5'>
			<p
				className='text-white font-medium text-xl leading-[24px] tracking-[0.01em] pb-[17.45px] border-0 border-b border-solid border-blue_primary m-0'
			>
				{comments?.length || 0} Comments
			</p>
			<CreateComment />
			{
				comments && Array.isArray(comments) && comments.length > 0?
					<Comments />
					: null
			}
		</div>
	);
};

export default CommentsWrapper;