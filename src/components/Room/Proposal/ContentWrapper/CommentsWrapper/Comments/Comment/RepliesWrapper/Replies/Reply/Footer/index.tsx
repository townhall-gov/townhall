// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import ReplyReactions from './Reactions';
import ReplyOtherActionsDropdown from './Other';
import { IReply } from '~src/types/schema';

interface ICommentFooterProps {
	reply: IReply;
}

const ReplyFooter: FC<ICommentFooterProps> = (props) => {
	const { reply } = props;
	if (!reply) return null;
	return (
		<footer className='flex items-center gap-x-3'>
			<ReplyReactions reply={reply}  />
			<ReplyOtherActionsDropdown reply={reply} />
		</footer>
	);
};

export default ReplyFooter;