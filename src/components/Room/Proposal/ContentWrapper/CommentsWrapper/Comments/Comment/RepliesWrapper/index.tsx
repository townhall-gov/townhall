// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import Replies from './Replies';
import { useReplyVisibility, useSelectedReplies } from '~src/redux/proposal/selectors';
// import { useDispatch } from 'react-redux';

import { useProposalSelector } from '~src/redux/selectors';
import { IReply } from '~src/types/schema';
import CreateReply from './CreateReply';
import { proposalActions } from '~src/redux/proposal';
import { useDispatch } from 'react-redux';

interface IRepliesWrapperProps {
	replies: IReply[]|null;
    comment_id:string;

}

const RepliesWrapper :FC<IRepliesWrapperProps>= (props) => {
	const select = 5;
	const { replies,comment_id }=props;
	console.log(replies);
	const { selectedReplies, total } = useSelectedReplies(select,replies);
	const { isAllRepliesVisible } = useProposalSelector();
	const { isVisible }= useReplyVisibility();
	const dispatch = useDispatch();
	console.log(selectedReplies);
	return (
		<div>
			{
				isVisible &&
			<>
				<div className='flex flex-col gap-y-5 mt-2'>
					<p
						className='text-white font-medium text-xl leading-[24px] tracking-[0.01em] pb-[17.45px] border-0 border-b border-solid border-blue_primary m-0'
					>
						{0 ||  total} Replies
					</p>
					<CreateReply comment_id={comment_id} replies={replies}/>
					{
						selectedReplies && Array.isArray(selectedReplies) && selectedReplies.length > 0?
							<Replies
								isAllRepliesVisible={isAllRepliesVisible}
								replies={selectedReplies}
							/>
							: null
					}
					{
						total > select?
							<div className='flex items-center justify-center border border-solid border-transparent border-b-[#373737] pb-1 drop-shadow-[0px_-9px_14px_#66A5FF]'>
								<button
									onClick={() => {
										dispatch(proposalActions.setIsAllRepliesVisible(!isAllRepliesVisible));
									}}
									className='border-none outline-none bg-transparent text-blue_primary font-medium text-sm leading-[22px] flex items-center justify-center cursor-pointer'
								>
									{
										isAllRepliesVisible?
											'Show Less':
											`Show More ${total - select} Replies`
									}
								</button>
							</div>
							: null
					}
				</div>
			</>

			}
		</div>

	);
};

export default RepliesWrapper;