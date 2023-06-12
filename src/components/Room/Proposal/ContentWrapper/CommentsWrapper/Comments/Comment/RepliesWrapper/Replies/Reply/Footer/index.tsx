// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import ReplyReactions from './Reactions';
import ReplytoReply from './Reply';
import ReplyOtherActionsDropdown from './Other';
import { IReply } from '~src/types/schema';
import Sentiment from './Sentiment';

interface ICommentFooterProps {
	reply: IReply;
}

const ReplyFooter: FC<ICommentFooterProps> = (props) => {
	const { reply } = props;
	if (!reply) return null;
	const { sentiment, id, reactions } = reply;
	return (
		<footer className='flex items-center gap-x-3'>
			<Sentiment sentiment={sentiment} />
			<ReplyReactions reply_id={id} reactions={reactions} comment_id={reply.comment_id}  />
			<ReplytoReply />
			<ReplyOtherActionsDropdown reply={reply} />
		</footer>
	);
};

export default ReplyFooter;