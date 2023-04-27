// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Input from '../../../../ui-components/Input';
import { useRoomCreation_CreatorDetails } from '~src/redux/rooms/selectors';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';

const CreatorDetails = () => {
	const creatorDetails = useRoomCreation_CreatorDetails();
	const dispatch = useDispatch();
	return (
		<article>
			<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
				Fill in your details.
			</p>
			<div className='flex flex-col mt-[28px] gap-y-5'>
				<Input
					value={creatorDetails?.name || ''}
					onChange={(v) => {
						dispatch(roomsActions.setRoomCreation_CreatorDetails({
							email: creatorDetails?.email || '',
							name: v,
							phone: creatorDetails?.phone || ''
						}));
					}}
					type='text'
					placeholder='Your Name'
				/>
				<Input
					value={creatorDetails?.email || ''}
					onChange={(v) => {
						dispatch(roomsActions.setRoomCreation_CreatorDetails({
							email: v,
							name: creatorDetails?.name || '',
							phone: creatorDetails?.phone || ''
						}));
					}}
					type='email'
					placeholder='Your E-mail id'
				/>
				<Input
					value={creatorDetails?.phone || ''}
					onChange={(v) => {
						dispatch(roomsActions.setRoomCreation_CreatorDetails({
							email: creatorDetails?.email || '',
							name: creatorDetails?.name || '',
							phone: v
						}));
					}}
					type='tel'
					placeholder='Your Contact/Telegram'
				/>
			</div>
		</article>
	);
};

export default CreatorDetails;