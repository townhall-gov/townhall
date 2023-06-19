// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Input from '../../../../ui-components/Input';
import { useRoomCreation_CreatorDetails } from '~src/redux/rooms/selectors';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { ICreatorDetails } from '~src/redux/rooms/@types';
import Error from '../Error';
import { removeError } from '~src/redux/rooms/validation';

type RoomCreatorDetailsKeys = keyof Omit<ICreatorDetails, 'address'>;
type RoomCreatorDetailsKeyArray = Array<RoomCreatorDetailsKeys>;
const roomCreatorDetailsKeyArray: RoomCreatorDetailsKeyArray = ['name', 'email', 'phone'];

const getPlaceholder = (key: RoomCreatorDetailsKeys) => {
	switch(key) {
	case 'name':
		return 'Your Name';
	case 'email':
		return 'Your E-mail id';
	case 'phone':
		return 'Your Contact/Telegram';
	}
	return '';
};

const CreatorDetails = () => {
	const creatorDetails = useRoomCreation_CreatorDetails();
	const dispatch = useDispatch();
	return (
		<article>
			<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
				Fill in your details.
			</p>
			<div className='flex flex-col mt-[28px] gap-y-5'>
				{
					roomCreatorDetailsKeyArray.map((key) => {
						const id = `creator_details_${key}`;
						return (
							<article key={key}>
								<Input
									value={creatorDetails?.[key] || ''}
									onChange={(v) => {
										removeError(id);
										dispatch(roomsActions.setRoomCreation_CreatorDetails({
											key: key,
											value: v
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

export default CreatorDetails;