// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { IReply } from '~src/types/schema';
import Reply from './Reply';

interface IReplyProps {
	replies: IReply[];
	isAllRepliesVisible: boolean;
}

const Replies: FC<IReplyProps> = (props) => {
	const { replies } = props;
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