// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { Image, Spin } from 'antd';
import classNames from 'classnames';
import Link from 'next/link';
import { IJoinRoomBody, IJoinRoomResponse } from 'pages/api/auth/actions/joinRoom';
import { ILeaveRoomBody, ILeaveRoomResponse } from 'pages/api/auth/actions/leaveRoom';
import { FC, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { profileActions } from '~src/redux/profile';
import { useProfileIsRoomJoined } from '~src/redux/profile/selectors';
import { roomActions } from '~src/redux/room';
import { ERoomStage } from '~src/redux/room/@types';
import { roomsActions } from '~src/redux/rooms';
import { useRoomsSelector } from '~src/redux/selectors';
import { useProfileSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { IRoom } from '~src/types/schema';
import { CropFreeIcon } from '~src/ui-components/CustomIcons';
import DefaultNameImage from '~src/ui-components/DefaultNameImage';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IRoomProps {
	room: IRoom;
}

const Room: FC<IRoomProps> = (props) => {
	const { room } = props;
	const { title, id, house_id, total_members, logo } = room;
	const dispatch = useDispatch();
	const { user } = useProfileSelector();
	const isRoomJoined = useProfileIsRoomJoined(house_id, id);
	const { joinOrRemoveRoom } = useRoomsSelector();
	const isDisabled = joinOrRemoveRoom === id;
	const joinBtnRef = useRef<HTMLButtonElement>(null!);

	const onClick = async () => {
		if (isDisabled) {
			return;
		}
		if (user && user.address) {
			try {
				dispatch(roomsActions.setJoinOrRemoveRoom(id));
				if (isRoomJoined) {
					const { data, error } = await api.post<ILeaveRoomResponse, ILeaveRoomBody>('auth/actions/leaveRoom', {
						houseId: house_id,
						roomId: id
					});
					if (error) {
						dispatch(roomsActions.setError(getErrorMessage(error)));
					} else if (!data) {
						dispatch(roomsActions.setError('Something went wrong, unable to leave the room.'));
					} else {
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
					}
				} else {
					const { data, error } = await api.post<IJoinRoomResponse, IJoinRoomBody>('auth/actions/joinRoom', {
						houseId: house_id,
						roomId: id
					});
					if (error) {
						dispatch(roomsActions.setError(getErrorMessage(error)));
					} else if (!data) {
						dispatch(roomsActions.setError('Something went wrong, unable to join the room.'));
					} else {
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
					}
				}
				dispatch(roomsActions.setJoinOrRemoveRoom(null));
			} catch (error) {
				dispatch(roomsActions.setJoinOrRemoveRoom(null));
				dispatch(roomsActions.setError(getErrorMessage(error)));
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
		<>
			<article
				onMouseEnter={() => {
					if (joinBtnRef.current) {
						if (isRoomJoined && joinBtnRef.current.textContent?.includes('Joined')) {
							joinBtnRef.current.textContent = 'Leave';
						}
					}
				}}
				onMouseLeave={() => {
					if (joinBtnRef.current) {
						if (isRoomJoined && joinBtnRef.current.textContent?.includes('Leave')) {
							joinBtnRef.current.textContent = 'Joined';
						}
					}
				}}
				className={classNames('highlight flex flex-col items-center justify-center gap-y-2 cursor-pointer', {
					'room-disabled': isDisabled,
					'room-hover': !isRoomJoined,
					'room-hover-joined': isRoomJoined,
					'room-joined': isRoomJoined
				})}
			>
				<Link
					href={`/house/${house_id}/room/${id}/proposals`}
					onClick={() => {
						dispatch(roomActions.setRoom(room));
						dispatch(roomActions.setCurrentStage(ERoomStage.PROPOSALS));
					}}
					className='border border-solid border-blue_primary rounded-lg outline-none flex flex-col gap-y-2 items-center bg-transparent p-5 px-7 cursor-pointer w-full min-w-[188px] min-h-[186px]'
				>
					{
						logo?
							<Image preview={false} width={45} height={45} className='rounded-full' src={logo} alt='room logo' />
							: <DefaultNameImage className='w-[45px] h-[45px]' name={title} />
					}

					<h3 className='text-white m-0 p-0 text-2xl leading-[29px] tracking-[0.01em] font-semibold'>{title}</h3>
					<p className='m-0 text-sm font-normal leading-[17px] text-grey_tertiary'>{total_members} Members</p>
					<CropFreeIcon className='text-grey_primary text-lg mt-[3px]' />
				</Link>
				<Spin
					className='text-white'
					wrapperClassName='w-full rounded-2xl overflow-hidden'
					spinning={isDisabled}
					indicator={<LoadingOutlined />}
				>
					<button
						ref={joinBtnRef}
						disabled={isDisabled}
						onClick={onClick}
						className='join border border-solid border-blue_primary rounded-2xl outline-none flex items-center justify-center py-1 px-2 w-full bg-transparent text-sm leading-[20px] font-semibold text-white cursor-pointer'
					>
						{ isRoomJoined ? 'Joined' : 'Join' }
					</button>
				</Spin>
			</article>
		</>
	);
};

export default Room;