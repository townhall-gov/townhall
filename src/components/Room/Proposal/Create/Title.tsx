// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { useProposalCreation } from '~src/redux/room/selectors';
import { useRoomSelector } from '~src/redux/selectors';
import Input from '~src/ui-components/Input';

const Title = () => {
	const proposalCreation = useProposalCreation();
	const dispatch = useDispatch();
	const { loading, isPropsalPreviewState } = useRoomSelector();
	return (
		<div className='flex flex-col'>
			<h3 className='text-white font-medium text-xl'>Title</h3>
			<Input
				// Title class is for error validation highlighting
				className={classNames('text-white pt-4 pb-4', 'title')}
				onChange={(v) => {
					dispatch(roomActions.setProposalCreation_Field({
						key: 'title',
						value: v
					}));
				}}
				type='text'
				value={proposalCreation?.title}
				placeholder='Title'
				isDisabled={isPropsalPreviewState||loading}
			/>
		</div>
	);
};

export default Title;