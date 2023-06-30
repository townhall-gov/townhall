// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from 'react';
import { useRoomCreationCurrentStage } from '~src/redux/rooms/selectors';
import { getNextCreationStage } from '../utils';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { ERoomCreationStage } from '~src/redux/rooms/@types';
import roomCreationValidation, { addError } from '~src/redux/rooms/validation';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import api from '~src/services/api';
import getErrorMessage from '~src/utils/getErrorMessage';
import { ICreateRoomBody, ICreateRoomResponse } from 'pages/api/auth/actions/createRoom';
import { useRouter } from 'next/router';
import { roomActions } from '~src/redux/room';
import { Button } from 'antd';
import { useProfileSelector, useRoomsSelector } from '~src/redux/selectors';
import classNames from 'classnames';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { profileActions } from '~src/redux/profile';
import { ICurrentBalanceResponse, ICurrentBalanceBody } from 'pages/api/chain/data/currentBalance';
import { formatToken } from '~src/utils/formatTokenAmount';
import { MIN_TOKEN_TO_CREATE_ROOM } from '~src/global/min_token';

const StageChangeBtn = () => {
	const router = useRouter();
	const { user } = useProfileSelector();
	const roomCreationCurrentStage = useRoomCreationCurrentStage();
	const { loading, roomCreation } = useRoomsSelector();
	const nextCreationStage = getNextCreationStage(roomCreationCurrentStage);
	const dispatch = useDispatch();
	const { connectWallet, isLoggedIn } = useAuthActionsCheck();
	const [canCreateRoom, setCanCreateRoom] = useState(false);
	const [dappInfo, setDappInfo] = useState({
		decimals: '',
		symbol: ''
	});

	useEffect(() => {
		(async () => {
			setCanCreateRoom(false);
			if (roomCreation.select_house && user?.address && roomCreation.room_details?.contract_address) {
				try {
					const { data, error } = await api.post<ICurrentBalanceResponse, ICurrentBalanceBody>('chain/data/currentBalance', {
						address: user?.address,
						contract: roomCreation.room_details?.contract_address,
						network: roomCreation.select_house.blockchain
					});
					if (error) {
						dispatch(notificationActions.send({
							message: getErrorMessage(error),
							status: ENotificationStatus.ERROR,
							title: 'Error!'
						}));
					} else if (!data || !data.balance || !data.decimals || !data.symbol) {
						dispatch(notificationActions.send({
							message: 'This token is not supported.',
							status: ENotificationStatus.ERROR,
							title: 'Error!'
						}));
					} else {
						const token = formatToken(data?.balance || 0, true, Number(data?.decimals || 0));
						setDappInfo({
							decimals: data?.decimals || '',
							symbol: data?.symbol || ''
						});
						if (token && Number(token) >= Number(roomCreation.select_house.min_token_to_create_room || MIN_TOKEN_TO_CREATE_ROOM)) {
							setCanCreateRoom(true);
						}
					}
				} catch (error) {
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Error!'
					}));
				}
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.address, roomCreation.select_house, roomCreation.room_details?.contract_address]);

	const onStageChange = () => {
		if (!isLoggedIn) {
			connectWallet();
			return;
		}
		const arr = Object.values(ERoomCreationStage);
		for(let i = 0; i < arr.length; i++) {
			const stage = arr[i];
			const error = roomCreationValidation?.[stage]?.(roomCreation);
			const errors = Object.entries(error);
			if (errors.length > 0) {
				errors.forEach(([key, value]) => {
					addError(key, value);
				});
				return;
			}
			if (stage === roomCreationCurrentStage) {
				break;
			}
		}
		if (nextCreationStage) {
			dispatch(roomsActions.setRoomCreationStage(nextCreationStage.stage));
		} else {
			if (!canCreateRoom) {
				dispatch(notificationActions.send({
					message: 'You can\'t create a room with less than 10 tokens.',
					status: ENotificationStatus.ERROR,
					title: 'Error!'
				}));
				return;
			}
			(async () => {
				const { creator_details, room_details, room_socials, select_house, room_strategies } = roomCreation;
				try {
					dispatch(roomsActions.setLoading(true));
					const { data, error } = await api.post<ICreateRoomResponse, ICreateRoomBody>('auth/actions/createRoom', {
						room: {
							admins: [
								{
									addresses: [user?.address || ''],
									name: creator_details?.name || user?.username || ''
								}
							],
							contract_address: room_details?.contract_address || '',
							creator_details: creator_details!,
							decimals: dappInfo.decimals,
							description: room_details?.description || '',
							house_id: select_house?.id || '',
							id: room_details?.name || '',
							logo: room_details?.logo || '',
							socials: room_socials || [],
							symbol: dappInfo.symbol,
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
						router.push(`/${room.house_id}/${room.id}/proposals`);
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