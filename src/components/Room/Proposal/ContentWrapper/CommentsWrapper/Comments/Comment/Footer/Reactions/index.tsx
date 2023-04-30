// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { EReaction } from '~src/types/enums';
import Reaction from '~src/ui-components/Reaction';

const CommentReactions = () => {
	const onReaction = async () => {};
	return (
		<div className='flex items-center gap-x-[15px]'>
			<Reaction
				className='text-xs font-normal leading-[22px]'
				count={0}
				loading={false}
				onReaction={onReaction}
				type={EReaction.LIKE}
			/>
			<Reaction
				className='text-xs font-normal leading-[22px]'
				count={0}
				loading={false}
				onReaction={onReaction}
				type={EReaction.DISLIKE}
			/>
		</div>
	);
};

export default CommentReactions;