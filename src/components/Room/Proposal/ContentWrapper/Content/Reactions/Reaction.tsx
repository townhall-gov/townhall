// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import React, { FC } from 'react';

export enum EReactionType {
    LIKE = 'like',
    DISLIKE = 'dislike',
}

interface IReactionProps {
    type: EReactionType;
}

const Reaction: FC<IReactionProps> = (props) => {
	const { type } = props;
	return (
		<button
			className='border-none outline-none flex items-center justify-center gap-x-[6px] bg-transparent text-blue_primary cursor-pointer'
		>
			{
				type === EReactionType.LIKE?
					<LikeOutlined />:
					<DislikeOutlined />
			}
			<span>2k</span>
		</button>
	);
};

export default Reaction;