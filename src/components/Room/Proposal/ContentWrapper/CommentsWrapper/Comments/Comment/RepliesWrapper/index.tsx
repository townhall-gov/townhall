// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import Replies from './Replies';
import { useRepliesVisibility, useReplyBoxVisibility, useSelectedReplies } from '~src/redux/proposal/selectors';
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
	const select = 2;
	const { replies,comment_id }=props;
	const { selectedReplies, total } = useSelectedReplies(select,replies);
	const { isAllRepliesVisible  } = useProposalSelector();
	const { replybox_comment_id, replybox_isVisible }= useReplyBoxVisibility();
	const { replies_comment_id , replies_isVisible } = useRepliesVisibility();
	const dispatch = useDispatch();
	return (
		<div>
			{
				<div className='flex flex-col gap-y-5 mt-2'>
					{replybox_isVisible && replybox_comment_id==comment_id  && <CreateReply comment_id={comment_id} replies={replies}/>}
					{
						replies_isVisible && replies_comment_id==comment_id &&
						<>
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
													parseInt(`${total - select}`)==1 ? `Show More ${total - select} Reply`:`Show More ${total - select} Replies`
											}
										</button>
									</div>
									: null
							}
						</>
					}
				</div>
			}
		</div>

	);
};

export default RepliesWrapper;