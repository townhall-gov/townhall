// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IJoinRoomResponse, IJoinRoomBody } from 'pages/api/auth/actions/joinRoom';
import { ILeaveRoomResponse, ILeaveRoomBody } from 'pages/api/auth/actions/leaveRoom';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { profileActions } from '~src/redux/profile';
import { useIsJoinOrRemoveHouseId, useProfileIsHouseJoined } from '~src/redux/profile/selectors';
import { roomsActions } from '~src/redux/rooms';
import { useProfileSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { IHouse } from '~src/types/schema';
import RoomHouseCard from '~src/ui-components/RoomHouseCard';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IHouseProps extends IHouse {}

const House: FC<IHouseProps> = (props) => {
	const { title, id, total_members, logo } = props;
	const isJoined = useProfileIsHouseJoined(id);
	const { user } = useProfileSelector();
	const dispatch = useDispatch();
	const isDisabled = useIsJoinOrRemoveHouseId(id);

	const onClick = async () => {
		if (isDisabled) {
			return;
		}
		if (user && user.address) {
			try {
				dispatch(profileActions.joinHouse(id));
				dispatch(profileActions.joinRoom(id));
				if (isJoined) {
					const { data, error } = await api.post<ILeaveRoomResponse, ILeaveRoomBody>('auth/actions/leaveRoom', {
						houseId: id,
						roomId: id
					});
					if (data) {
						dispatch(notificationActions.send({
							message: 'You have left the room successfully.',
							status: ENotificationStatus.SUCCESS,
							title: 'Success'
						}));
						dispatch(profileActions.removeJoinedRoom({
							houseId: id,
							roomId: id
						}));
						dispatch(roomsActions.updateRoom({
							room: data.updatedRoom,
							roomId: id
						}));
					} else {
						dispatch(notificationActions.send({
							message: getErrorMessage(error) || 'Something went wrong, unable to leave the room.',
							status: ENotificationStatus.ERROR,
							title: 'Error!'
						}));
					}
				} else {
					const { data, error } = await api.post<IJoinRoomResponse, IJoinRoomBody>('auth/actions/joinRoom', {
						houseId: id,
						roomId: id
					});
					if (data) {
						dispatch(notificationActions.send({
							message: 'You have joined the room successfully.',
							status: ENotificationStatus.SUCCESS,
							title: 'Success'
						}));
						dispatch(profileActions.addJoinedRoom({
							houseId: id,
							joinedRoom: {
								...data.joinedRoom,
								...data.updatedRoom
							}
						}));
						dispatch(roomsActions.updateRoom({
							room: data.updatedRoom,
							roomId: id
						}));
					} else {
						dispatch(notificationActions.send({
							message: getErrorMessage(error) || 'Something went wrong, unable to join the room.',
							status: ENotificationStatus.ERROR,
							title: 'Error!'
						}));
					}
				}
				dispatch(profileActions.removeHouse(id));
				dispatch(profileActions.removeRoom(id));
			} catch (error) {
				dispatch(profileActions.removeHouse(id));
				dispatch(profileActions.removeRoom(id));
				dispatch(notificationActions.send({
					message: getErrorMessage(error),
					status: ENotificationStatus.ERROR,
					title: 'Error!'
				}));
			}
		} else {
			dispatch(modalActions.setModal({
				contentType: EContentType.CONNECT_WALLET,
				footerType: EFooterType.NONE,
				open: true,
				titleType: ETitleType.CONNECT_WALLET
			}));
		}
	};

	return (
		<RoomHouseCard
			isDisabled={isDisabled}
			isJoined={isJoined}
			link={`/${id}/rooms`}
			logo={logo}
			name={title}
			onClick={onClick}
			totalMembers={total_members}
		/>
	);
	/**
	return (
		<Link href={`/${id}/rooms`} className='border border-solid border-blue_primary rounded-lg outline-none flex flex-col gap-y-2 items-center bg-transparent p-5 px-7 cursor-pointer min-w-[188px] min-h-[186px]'>
			<BlockchainIcon className='text-[45px]' type={blockchain} />
			<h3 className='text-white m-0 p-0 text-2xl leading-[29px] tracking-[0.01em] font-semibold'>{title}</h3>
			<p className='m-0 text-sm font-normal leading-[17px] text-grey_tertiary'>
				{total_members} Rooms
			</p>
			<CropFreeIcon className='text-[#94A2AF] text-lg mt-[3px]' />
		</Link>
	);
	**/
};

export default House;