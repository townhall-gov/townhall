// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Tooltip } from 'antd';
import React, { FC } from 'react';
import { IStrategy } from '~src/redux/rooms/@types';
import { ToolTipIcon } from '~src/ui-components/CustomIcons';

interface IVotingThresholdProps {
	isDisabled?: boolean;
	strategy: IStrategy;
    className?: string;
}

const SelectedVotingThreshold: FC<IVotingThresholdProps> = (props) => {
	const { strategy } = props;
	return (
		<article className='grid grid-cols-2 mb-[16px]'>
			<div className='flex items-center'>
				<p>Voting Threshold</p>
				<Tooltip
					color='#66A5FF'
					overlayClassName='min-w-max'
					title={
						<div>
							{'Only account with balance >= threshold can vote'}
						</div>
					}
				>
					<p className='text-md'>
						<ToolTipIcon/>
					</p>
				</Tooltip>
			</div>
			<span>{strategy.threshold}</span>
		</article>
	);
};

export default SelectedVotingThreshold;