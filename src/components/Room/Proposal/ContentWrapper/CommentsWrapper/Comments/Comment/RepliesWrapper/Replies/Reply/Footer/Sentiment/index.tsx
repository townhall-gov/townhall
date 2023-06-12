// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Tooltip } from 'antd';
import React, { FC } from 'react';
import { ESentiment } from '~src/types/enums';
import SentimentIcon from '~src/ui-components/SentimentIcon';

interface ICommentSentimentProps {
    sentiment: ESentiment | null;
}

const CommentSentiment: FC<ICommentSentimentProps> = (props) => {
	const { sentiment } = props;
	if (!sentiment || typeof sentiment?.toString() !== 'string') return null;
	return (
		<>
			<Tooltip
				color='#66A5FF'
				title={sentiment?.toString()?.split('_')?.map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).join(' ')}
			>
				<span>
					<SentimentIcon
						type={sentiment}
						className='text-purple_primary text-[22px]'
					/>
				</span>
			</Tooltip>
		</>
	);
};

export default CommentSentiment;