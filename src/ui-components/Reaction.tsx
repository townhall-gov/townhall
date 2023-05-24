// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import classNames from 'classnames';
import React, { FC } from 'react';
import { EReaction } from '~src/types/enums';

interface IReactionProps {
    type: EReaction;
	loading: boolean;
	count: number;
	userReaction?: EReaction | null;
	onReaction: (type: EReaction) => Promise<void>;
	className?: string;
}

const Reaction: FC<IReactionProps> = (props) => {
	const { type, count, onReaction, loading, userReaction, className } = props;

	return (
		<button
			disabled={loading}
			onClick={() => onReaction(type)}
			className={classNames('border-none outline-none flex items-center justify-center gap-x-[6px] bg-transparent text-blue_primary', className, {
				'cursor-not-allowed': loading,
				'cursor-pointer': !loading
			})}
		>
			{
				type === EReaction.LIKE?
					(userReaction === type? <LikeFilled />:<LikeOutlined />):
					(userReaction === type? <DislikeFilled /> :<DislikeOutlined />)
			}
			<span>
				{count}
			</span>
		</button>
	);
};

export default Reaction;