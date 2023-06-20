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
		<section id={id} className='grid grid-cols-12 gap-x-[10px] p-2 pb-0 border-0 relative border-l-2 border-solid border-blue_primary rounded-none'>
			<article className='w-10'>
				<RepliedUserImage />
			</article>
			<article id={`${id}-content`} className='flex-1 col-span-11 -ml-3'>
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