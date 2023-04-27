// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
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
import { roomsActions } from '~src/redux/rooms';
import { useRoomsSelector } from '~src/redux/selectors';
import { useProfileSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { EBlockchain } from '~src/types/enums';
import { IRoom } from '~src/types/schema';
import BlockchainIcon from '~src/ui-components/BlockchainIcon';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IRoomProps extends IRoom {}

const Room: FC<IRoomProps> = (props) => {
	const { title, id, house_id, total_members } = props;
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
							joinedRoom: data.joinedRoom
						}));
						dispatch(roomsActions.updateRoom({
							room: data.updatedRoom,
							roomId: id
						}));
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
		<Link
			href={`/house/${house_id}/room/${id}`}
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
			<button
				className='border border-solid border-blue_primary rounded-lg outline-none flex flex-col gap-y-2 items-center bg-transparent p-5 px-7 cursor-pointer'
			>
				<BlockchainIcon className='text-4xl' type={EBlockchain.KUSAMA} />
				<h3 className='text-white m-0 p-0 text-xl leading-none tracking-[0.01em] font-normal'>{title}</h3>
				<p className='m-0 text-xs font-normal leading-[17px] text-grey_tertiary'>{total_members} Members</p>
			</button>
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
		</Link>
	);
};

export default Room;