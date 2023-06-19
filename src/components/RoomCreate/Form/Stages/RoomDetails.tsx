// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { useRoomCreation_RoomDetails } from '~src/redux/rooms/selectors';
import Input from '../../../../ui-components/Input';
import ImageUpload from '~src/ui-components/ImageUpload';
import Error from '../Error';
import { IRoomDetails } from '~src/redux/rooms/@types';
import { removeError } from '~src/redux/rooms/validation';

type RoomDetailsKeys = keyof IRoomDetails;
type RoomDetailsKeyArray = Array<RoomDetailsKeys>;
const roomDetailsKeyArray: RoomDetailsKeyArray = ['logo', 'name', 'contract_address', 'title', 'description'];

const getPlaceholder = (key: RoomDetailsKeys) => {
	switch(key) {
	case 'name':
		return 'Room unique name';
	case 'contract_address':
		return 'Room contract address';
	case 'title':
		return 'Room title';
	case 'description':
		return 'Room description';
	}
	return '';
};

const RoomDetails = () => {
	const roomDetails = useRoomCreation_RoomDetails();
	const dispatch = useDispatch();
	return (
		<article>
			<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
				A Room Name is Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..
			</p>
			<div className='flex flex-col mt-[28px] gap-y-5'>
				{
					roomDetailsKeyArray.map((key) => {
						const id = `room_details_${key}`;
						if (key === 'logo') {
							return (
								<article key={key}>
									<ImageUpload
										imageUrl={roomDetails?.logo || ''}
										setImageUrl={(v) => {
											removeError(id);
											dispatch(roomsActions.setRoomCreation_RoomDetails_Field({
												key: 'logo',
												value: v
											}));
										}}
									/>
									<Error id={id} />
								</article>
							);
						}
						return (
							<article key={key}>
								<Input
									value={roomDetails?.[key] || ''}
									onChange={(v) => {
										removeError(id);
										dispatch(roomsActions.setRoomCreation_RoomDetails_Field({
											key: key,
											value: key === 'name'? v.toLowerCase(): v
										}));
									}}
									type='text'
									placeholder={getPlaceholder(key)}
								/>
								<Error id={id} />
							</article>
						);
					})
				}
			</div>
		</article>
	);
};

export default RoomDetails;