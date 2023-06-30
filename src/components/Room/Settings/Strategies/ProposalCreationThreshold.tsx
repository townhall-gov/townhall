// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { IStrategy } from '~src/redux/rooms/@types';
import Input from '~src/ui-components/Input';

interface IProposalCreationThresholdProps {
    isDisabled?: boolean;
	strategy: IStrategy;
    className?: string;
}

const ProposalCreationThreshold: FC<IProposalCreationThresholdProps> = (props) => {
	const { isDisabled, strategy } = props;
	const dispatch = useDispatch();
	return (
		<article>
			<h5 className='mb-1'>
                Proposal creation Threshold.
			</h5>
			<Input
				placeholder='0'
				isDisabled={isDisabled}
				value={strategy?.proposal_creation_threshold || ''}
				type='number'
				onChange={(v) => {
					dispatch(roomActions.setRoomSettingsStrategiesEdit({
						...strategy,
						proposal_creation_threshold: v
					}));
				}}
			/>
		</article>
	);
};

export default ProposalCreationThreshold;