// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { houseActions } from '~src/redux/house';
import Input from '~src/ui-components/Input';

interface IMinTokenToCreateRoomProps {
	isDisabled?: boolean;
    min_token_to_create_room: number | string;
    className?: string;
}

const MinTokenToCreateRoom: FC<IMinTokenToCreateRoomProps> = (props) => {
	const { isDisabled, className, min_token_to_create_room } = props;
	const dispatch = useDispatch();

	return (
		<article className={className}>
			<h5 className='text-white text-xl font-semibold'>Minimum token to create a room</h5>
			<Input
				placeholder='0'
				isDisabled={isDisabled}
				value={min_token_to_create_room}
				type='number'
				onChange={(v) => {
					dispatch(houseActions.setHouseSettings_Field({
						key: 'min_token_to_create_room',
						value: Number(v)
					}));
				}}
			/>
		</article>
	);
};

export default MinTokenToCreateRoom;