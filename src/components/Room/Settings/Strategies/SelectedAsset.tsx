// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { IStrategy } from '~src/redux/rooms/@types';

interface IProposalCreationThresholdProps {
	strategy: IStrategy;
}

const SelectedAsset: FC<IProposalCreationThresholdProps> = () => {
	return (
		<div className='grid grid-cols-2 mb-[16px]'>
			<p>Asset</p>
			<span className='flex items-center'>
				Asset
			</span>
		</div>
	);
};

export default SelectedAsset;