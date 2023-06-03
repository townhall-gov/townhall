// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { useRoomSettings } from '~src/redux/room/selectors';
import Input from '~src/ui-components/Input';

interface IMinTokenToCreateProposalProps {
    isDisabled?: boolean;
}

const MinTokenToCreateProposal: FC<IMinTokenToCreateProposalProps> = (props) => {
	const { isDisabled } = props;
	const dispatch = useDispatch();
	const roomSettings = useRoomSettings();
	return (
		<div>
			<h3
				className='text-white font-medium text-xl'
			>
                Min token to create a Proposal in this Room.
			</h3>
			<Input
				// Title class is for error validation highlighting
				className={classNames('text-white pt-4 pb-4')}
				onChange={(v) => {
					dispatch(roomActions.setRoomSettings_Field({
						key: 'min_token_to_create_proposal_in_room',
						value: Number(v)
					}));
				}}
				type='number'
				value={roomSettings?.min_token_to_create_proposal_in_room || ''}
				placeholder='eg. 10'
				isDisabled={isDisabled}
			/>
		</div>
	);
};

export default MinTokenToCreateProposal;