// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useEffect } from 'react';
import { IReply } from '~src/types/schema';
import Reply from './Reply';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';

interface IReplyProps {
	replies: IReply[];
	isAllRepliesVisible: boolean;
}

const Replies: FC<IReplyProps> = (props) => {
	const { replies, isAllRepliesVisible } = props;
	const dispatch = useDispatch();
	useEffect(() => {
		if (typeof window == 'undefined') return;
		if (window.location.hash) {
			const hash = window.location.hash.replace('#', '');
			const reply = replies.find((reply) => reply.comment_id+reply.id === hash);
			console.log(reply);
			if (reply && !isAllRepliesVisible) {
				dispatch(proposalActions.setIsAllRepliesVisible(true));
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [replies]);
	return (
		<section className='text-white mt-5 flex flex-col gap-y-6'>
			{
				replies.map((reply, index) => {
					return (
						<Reply
							key={`${reply.id} + ${index}`}
							reply={reply}
						/>
					);
				})
			}
		</section>
	);
};

export default Replies;