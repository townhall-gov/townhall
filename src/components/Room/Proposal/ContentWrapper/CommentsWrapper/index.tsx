// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import CreateComment from './CreateComment';
import Comments from './Comments';
import { useSelectedComments } from '~src/redux/proposal/selectors';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { useProposalSelector } from '~src/redux/selectors';

const CommentsWrapper = () => {
	const select = 5;
	const { comments, total } = useSelectedComments(select);
	const { isAllCommentsVisible } = useProposalSelector();
	const dispatch = useDispatch();
	return (
		<div className='flex flex-col gap-y-5'>
			<p
				className='text-white font-medium text-xl leading-[24px] tracking-[0.01em] pb-[17.45px] border-0 border-b border-solid border-blue_primary m-0'
			>
				{total || 0} Comments
			</p>
			<CreateComment />
			{
				comments && Array.isArray(comments) && comments.length > 0?
					<Comments
						isAllCommentsVisible={isAllCommentsVisible}
						comments={comments}
					/>
					: null
			}
			{
				total > select?
					<div className='flex items-center justify-center border border-solid border-transparent border-b-[#373737] pb-1 drop-shadow-[0px_-9px_14px_#66A5FF]'>
						<button
							onClick={() => {
								dispatch(proposalActions.setIsAllCommentsVisible(!isAllCommentsVisible));
							}}
							className='border-none outline-none bg-transparent text-blue_primary font-medium text-sm leading-[22px] flex items-center justify-center cursor-pointer'
						>
							{
								isAllCommentsVisible?
									'Show Less':
									`Show More ${total - select} Comments`
							}
						</button>
					</div>
					: null
			}
		</div>
	);
};

export default CommentsWrapper;