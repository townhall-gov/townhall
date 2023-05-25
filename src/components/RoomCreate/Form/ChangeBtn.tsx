// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useRoomCreationCurrentStage } from '~src/redux/rooms/selectors';
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
import { roomActions } from '~src/redux/room';
import { Button } from 'antd';
import { useRoomsSelector } from '~src/redux/selectors';
import classNames from 'classnames';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { profileActions } from '~src/redux/profile';

const StageChangeBtn = () => {
	const router = useRouter();
	const roomCreationCurrentStage = useRoomCreationCurrentStage();
	const { loading, roomCreation } = useRoomsSelector();
	const nextCreationStage = getNextCreationStage(roomCreationCurrentStage);
	const dispatch = useDispatch();
	const { connectWallet, isLoggedIn } = useAuthActionsCheck();

	const onStageChange = () => {
		if (!isLoggedIn) {
			connectWallet();
			return;
		}
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
					const { creator_details, room_details, room_socials, select_house, room_strategies } = roomCreation;
					try {
						dispatch(roomsActions.setLoading(true));
						const { data, error } = await api.post<ICreateRoomResponse, ICreateRoomBody>('auth/actions/createRoom', {
							room: {
								contract_address: '',
								creator_details: creator_details!,
								description: room_details?.description || '',
								house_id: select_house?.id || '',
								id: room_details?.name || '',
								logo: room_details?.logo || '',
								socials: room_socials || [],
								title: room_details?.title || '',
								voting_strategies: room_strategies || []
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
							dispatch(roomActions.setRoom(room));
							dispatch(profileActions.addJoinedRoom({
								houseId: room.house_id,
								joinedRoom: {
									...data.joinedRoom,
									...room
								}
							}));
							dispatch(roomsActions.setLoading(false));
							dispatch(roomsActions.setRoomCreationReset());
							router.push(`/house/${room.house_id}/room/${room.id}/proposals`);
						}
						dispatch(roomsActions.setLoading(false));
					} catch (error) {
						dispatch(roomsActions.setLoading(false));
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
		<>
			<Button
				loading={loading}
				onClick={onStageChange}
				disabled={loading}
				className={
					classNames('w-[200px] bg-blue_primary h-auto text-white py-[11px] px-[22px] rounded-2xl border border-solid border-blue_primary flex items-center justify-center text-base leading-[19px] tracking-[0.01em]', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})
				}
			>
				{nextCreationStage?.title || 'Submit'}
			</Button>
		</>
	);
};

export default StageChangeBtn;