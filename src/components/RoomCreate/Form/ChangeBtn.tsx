// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useRoomCreation, useRoomCreationCurrentStage } from '~src/redux/rooms/selectors';
import { getNextCreationStage } from '../utils';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { ERoomCreationStage } from '~src/redux/rooms/@types';
import roomCreationValidation from '~src/redux/rooms/validation';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import api from '~src/services/api';
import getErrorMessage from '~src/utils/getErrorMessage';
import { ICreateRoomBody, ICreateRoomResponse } from 'pages/api/auth/actions/createRoom';
import { useRouter } from 'next/router';

const StageChangeBtn = () => {
	const router = useRouter();
	const roomCreationCurrentStage = useRoomCreationCurrentStage();
	const roomCreation = useRoomCreation();
	const nextCreationStage = getNextCreationStage(roomCreationCurrentStage);
	const dispatch = useDispatch();

	const onStageChange = () => {
		if (nextCreationStage) {
			dispatch(roomsActions.setRoomCreationStage(nextCreationStage.stage));
		} else {
			let isError = false;
			Object.values(ERoomCreationStage).some((stage) => {
				const error = roomCreationValidation?.[stage]?.(roomCreation);
				if (error) {
					isError = true;
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Validation Error'
					}));
					dispatch(roomsActions.setRoomCreationStage(stage));
					return true;
				}
				return false;
			});
			if (!isError) {
				(async () => {
					const { creator_details, room_details, room_socials, select_house } = roomCreation;
					try {
						const { data, error } = await api.post<ICreateRoomResponse, ICreateRoomBody>('auth/actions/createRoom', {
							room: {
								contract_address: '',
								creator_details: creator_details!,
								description: '',
								house_id: select_house?.id || '',
								id: room_details?.name || '',
								socials: room_socials || [],
								title: ''
							}
						});
						if (error) {
							dispatch(roomsActions.setError(getErrorMessage(error)));
							dispatch(notificationActions.send({
								message: getErrorMessage(error),
								status: ENotificationStatus.ERROR,
								title: 'Failed'
							}));
						} else if (!data) {
							const error = 'Something went wrong, unable to leave the room.';
							dispatch(roomsActions.setError(error));
							dispatch(notificationActions.send({
								message: error,
								status: ENotificationStatus.ERROR,
								title: 'Failed'
							}));
						} else {
							dispatch(notificationActions.send({
								message: 'Room created successfully.',
								status: ENotificationStatus.SUCCESS,
								title: 'Success'
							}));
							const room = data.createdRoom;
							// GO to newly created room page
							router.push(`/house/${room.house_id}/room/${room.id}`);
						}
					} catch (error) {
						dispatch(notificationActions.send({
							message: getErrorMessage(error),
							status: ENotificationStatus.ERROR,
							title: 'Failed'
						}));
					}
				})();
			}
		}
	};

	return (
		<button
			onClick={onStageChange}
			className='max-w-[200px] bg-blue_primary text-white py-[11px] px-[22px] rounded-2xl border border-solid border-blue_primary flex items-center justify-center cursor-pointer text-base leading-[19px] tracking-[0.01em]'
		>
			{nextCreationStage?.title || 'Submit'}
		</button>
	);
};

export default StageChangeBtn;