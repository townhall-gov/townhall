// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IJoinRoomBody, IJoinRoomResponse } from 'pages/api/auth/actions/joinRoom';
import { ILeaveRoomBody, ILeaveRoomResponse } from 'pages/api/auth/actions/leaveRoom';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { profileActions } from '~src/redux/profile';
import { useIsJoinOrRemoveRoomId, useProfileIsRoomJoined } from '~src/redux/profile/selectors';
import { roomActions } from '~src/redux/room';
import { ERoomStage } from '~src/redux/room/@types';
import { roomsActions } from '~src/redux/rooms';
import { useProfileSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { IRoom } from '~src/types/schema';
import RoomHouseCard from '~src/ui-components/RoomHouseCard';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IRoomProps {
	room: IRoom;
}

const Room: FC<IRoomProps> = (props) => {
	const { room } = props;
	const { title, id, house_id, total_members, logo } = room;
	const isJoined = useProfileIsRoomJoined(house_id, id);
	const { user } = useProfileSelector();
	const dispatch = useDispatch();
	const isDisabled = useIsJoinOrRemoveRoomId(id);

	const onClick = async () => {
		if (isDisabled) {
			return;
		}
		if (user && user.address) {
			try {
				dispatch(profileActions.joinHouse(house_id));
				dispatch(profileActions.joinRoom(id));
				if (isJoined) {
					const { data, error } = await api.post<ILeaveRoomResponse, ILeaveRoomBody>('auth/actions/leaveRoom', {
						houseId: house_id,
						roomId: id
					});
					if (data) {
						dispatch(notificationActions.send({
							message: 'You have left the room successfully.',
							status: ENotificationStatus.SUCCESS,
							title: 'Success'
						}));
						dispatch(profileActions.removeJoinedRoom({
							houseId: house_id,
							roomId: id
						}));
						dispatch(roomsActions.updateRoom({
							room: data.updatedRoom,
							roomId: id
						}));
						dispatch(roomActions.setRoom(data.updatedRoom));
					} else {
						dispatch(notificationActions.send({
							message: getErrorMessage(error) || 'Something went wrong, unable to leave the room.',
							status: ENotificationStatus.ERROR,
							title: 'Error!'
						}));
					}
				} else {
					const { data, error } = await api.post<IJoinRoomResponse, IJoinRoomBody>('auth/actions/joinRoom', {
						houseId: house_id,
						roomId: id
					});
					if (data) {
						dispatch(notificationActions.send({
							message: 'You have joined the room successfully.',
							status: ENotificationStatus.SUCCESS,
							title: 'Success'
						}));
						dispatch(profileActions.addJoinedRoom({
							houseId: house_id,
							joinedRoom: {
								...data.joinedRoom,
								...data.updatedRoom
							}
						}));
						dispatch(roomsActions.updateRoom({
							room: data.updatedRoom,
							roomId: id
						}));
						dispatch(roomActions.setRoom(data.updatedRoom));
					} else {
						dispatch(notificationActions.send({
							message: getErrorMessage(error) || 'Something went wrong, unable to join the room.',
							status: ENotificationStatus.ERROR,
							title: 'Error!'
						}));
					}
				}
				dispatch(profileActions.removeHouse(house_id));
				dispatch(profileActions.removeRoom(id));
			} catch (error) {
				dispatch(profileActions.removeHouse(house_id));
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
		<div id={house_id} data-link={`/${house_id}/${id}/proposals`} className='basis-[15%]'>
			<RoomHouseCard
				isDisabled={isDisabled}
				isJoined={isJoined}
				link={`/${house_id}/${id}/proposals`}
				logo={logo}
				name={title}
				onClick={onClick}
				onLinkClick={() => {
					dispatch(roomActions.setRoom(room));
					dispatch(roomActions.setCurrentStage(ERoomStage.PROPOSALS));
				}}
				house_id={house_id}
				totalLabel={`${total_members} Members`}
			/>
		</div>
	);
};

export default Room;