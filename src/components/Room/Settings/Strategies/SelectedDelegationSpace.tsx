// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { IStrategy } from '~src/redux/rooms/@types';

interface IProposalCreationThresholdProps {
	strategy: IStrategy;
}

const SelectedDelegationSpace: FC<IProposalCreationThresholdProps> = (props) => {
	const { strategy } = props;
	const token_metadata = strategy.token_metadata[strategy.asset_type];
	if (!token_metadata) {
		return null;
	}
	return (
		<article className='grid grid-cols-2 mb-[16px]'>
			<p>DelegationSpace</p>
			<span>
				Delegation Space
			</span>
		</article>
	);
};

export default SelectedDelegationSpace;