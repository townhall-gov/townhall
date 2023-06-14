// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { IReply } from '~src/types/schema';
import RepliedUserImage from './RepliedUserImage';
import ReplyHeader from './Header';
import ReplyContent from './Content';
import ReplyFooter from './Footer';

interface ICommentProps {
	reply: IReply;
}

const Reply: FC<ICommentProps> = (props) => {
	const { reply } = props;

	if (!reply) return null;
	const { user_address, created_at, updated_at, history, id, comment_id } = reply;

	return (
		<section id={id} className='flex gap-x-[10px] rounded-md -ml-2 p-2 pb-0  border border-solid border-transparent relative'>
			<div>
				<div className='h-10 w-1'>
					<div className="h-[100px] bg-[#66A5FF] w-[2px]"></div>
				</div>
			</div>
			<article className='w-10'>
				<RepliedUserImage />
			</article>
			<article id={`${id}-content`} className='flex-1 flex flex-col border-0 border-b border-solid border-blue_primary pb-5'>
				<section className='flex flex-col gap-y-2'>
					<ReplyHeader
						created_at={created_at}
						updated_at={updated_at}
						history={history}
						user_address={user_address}
						comment_id={comment_id}
					/>
					<ReplyContent
						reply={reply}
					/>
					<ReplyFooter
						reply={reply}
					/>
				</section>
			</article>
		</section>
	);
};

export default Reply;