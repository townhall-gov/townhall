// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { useRoomCreation_RoomDetails } from '~src/redux/rooms/selectors';
import Input from '../../../../ui-components/Input';
import ImageUpload from '~src/ui-components/ImageUpload';

const RoomDetails = () => {
	const roomDetails = useRoomCreation_RoomDetails();
	const dispatch = useDispatch();
	return (
		<article>
			<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
				A Room Name is Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..
			</p>
			<div className='flex flex-col mt-[28px] gap-y-5'>
				<Input
					value={roomDetails?.name || ''}
					onChange={(v) => {
						dispatch(roomsActions.setRoomCreation_RoomDetails_Field({
							key: 'name',
							value: v
						}));
					}}
					type='text'
					placeholder='Room unique name'
				/>
				<Input
					value={roomDetails?.title || ''}
					onChange={(v) => {
						dispatch(roomsActions.setRoomCreation_RoomDetails_Field({
							key: 'title',
							value: v
						}));
					}}
					type='text'
					placeholder='Room title'
				/>
				<Input
					value={roomDetails?.description || ''}
					onChange={(v) => {
						dispatch(roomsActions.setRoomCreation_RoomDetails_Field({
							key: 'description',
							value: v
						}));
					}}
					type='text'
					placeholder='Room description'
				/>
				<ImageUpload
					imageUrl={roomDetails?.logo || ''}
					setImageUrl={(v) => {
						dispatch(roomsActions.setRoomCreation_RoomDetails_Field({
							key: 'logo',
							value: v
						}));
					}}
				/>
			</div>
		</article>
	);
};

export default RoomDetails;