// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { IStrategy } from '~src/redux/rooms/@types';
import Input from '~src/ui-components/Input';

interface IThresholdProps {
	isDisabled?: boolean;
	strategy: IStrategy;
    className?: string;
}

const Threshold: FC<IThresholdProps> = (props) => {
	const { isDisabled, strategy, className } = props;
	const dispatch = useDispatch();

	return (
		<article className={className}>
			<h5 className='mb-1'>Threshold</h5>
			<Input
				placeholder='0'
				isDisabled={isDisabled}
				value={strategy.threshold}
				type='number'
				onChange={(v) => {
					dispatch(roomActions.setRoomSettingsStrategiesEdit({
						...strategy,
						threshold: v
					}));
				}}
			/>
		</article>
	);
};

export default Threshold;