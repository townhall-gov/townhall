// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Tooltip } from 'antd';
import React, { FC } from 'react';
import { IStrategy } from '~src/redux/rooms/@types';

interface IVotingThresholdProps {
	isDisabled?: boolean;
	strategy: IStrategy;
    className?: string;
}

const SelectedVotingThreshold: FC<IVotingThresholdProps> = (props) => {
	const { strategy } = props;
	return (
		<article className='grid grid-cols-2 mb-[16px] -mt-1'>
			<div className='flex items-center '>
				<p>Voting Threshold</p>
				<span className='flex items-center mx-1 justify-center bg-grey_primary rounded-full text-[10px] text-white font-medium w-4 h-4'>
					<Tooltip
						color='#04152F'
						title={'Only account with balance >= threshold can vote'}
					>
										?
					</Tooltip>
				</span>
			</div>
			<span>{strategy.threshold}</span>
		</article>
	);
};

export default SelectedVotingThreshold;