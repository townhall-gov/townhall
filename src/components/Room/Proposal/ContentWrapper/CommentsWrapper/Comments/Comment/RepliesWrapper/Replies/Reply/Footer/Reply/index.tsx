// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import classNames from 'classnames';
import React from 'react';
import { useProposalSelector } from '~src/redux/selectors';
import { ReplyIcon } from '~src/ui-components/CustomIcons';

const ReplytoReply = () => {
	const { loading } = useProposalSelector();
	return (
		<div>
			<button
				disabled={loading}
				className={classNames('outline-none border-none bg-transparent flex items-center gap-x-1 text-blue_primary text-xs leading-[22px] font-normal', {
					'cursor-not-allowed': loading,
					'cursor-pointer': !loading
				})}
			>
				<ReplyIcon />
				<span>Reply</span>
			</button>
		</div>
	);
};

export default ReplytoReply;