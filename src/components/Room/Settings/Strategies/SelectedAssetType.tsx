// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { IStrategy } from '~src/redux/rooms/@types';

interface IProposalCreationThresholdProps {
	strategy: IStrategy;
}

const SelectedAssetType: FC<IProposalCreationThresholdProps> = (props) => {
	const { strategy } = props;
	return (
		<div className='grid grid-cols-2 mb-[16px]'>
			<p>Asset Type</p>
			<span className='flex items-center'>
				{strategy.asset_type}
			</span>
		</div>
	);
};

export default SelectedAssetType;