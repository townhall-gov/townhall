// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button } from 'antd';
import classNames from 'classnames';
import { IRoomSettingsBody, IRoomSettingsResponse } from 'pages/api/auth/actions/roomSettings';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { roomActions } from '~src/redux/room';
import { useRoomSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import getErrorMessage from '~src/utils/getErrorMessage';

interface ISaveBtnProps {
    isDisabled?: boolean;
}

const SaveBtn: FC<ISaveBtnProps> = (props) => {
	const { isDisabled } = props;
	const { loading, room, roomSettings } = useRoomSelector();
	const { connectWallet, isLoggedIn, isRoomJoined, joinRoom } = useAuthActionsCheck();
	const dispatch = useDispatch();
	const onSave = async () => {
		if (loading) return;
		if (!isLoggedIn) {
			connectWallet();
			return;
		}
		if (!isRoomJoined) {
			joinRoom();
			return;
		}
		if (isDisabled) {
			dispatch(notificationActions.send({
				message: 'You can\'t change Room setting you are not the Author of this Room.',
				status: ENotificationStatus.ERROR,
				title: 'Error!'
			}));
			return;
		}
		try {
			if (room && room.id && room.house_id) {
				dispatch(roomActions.setLoading(true));
				const { data, error } = await api.post<IRoomSettingsResponse, IRoomSettingsBody>('auth/actions/roomSettings', {
					houseId: room?.house_id,
					roomId: room?.id,
					roomSettings: roomSettings
				});
				if (error) {
					dispatch(roomActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data || !data.updatedRoom) {
					const error = 'Something went wrong, unable to update Room settings.';
					dispatch(roomActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					const { updatedRoom } = data;
					dispatch(roomActions.setRoom(updatedRoom));
					dispatch(notificationActions.send({
						message: 'Room settings updated successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
				}
				dispatch(roomActions.setLoading(false));
			}

		} catch (error) {
			dispatch(roomActions.setLoading(false));
			const err = getErrorMessage(error);
			dispatch(roomActions.setError(err));
			dispatch(notificationActions.send({
				message: err,
				status: ENotificationStatus.ERROR,
				title: 'Error!'
			}));
		}
	};
	return (
		<div className='mt-10'>
			<Button
				disabled={isDisabled}
				loading={loading}
				onClick={onSave}
				className={
					classNames('outline-none border h-full border-solid border-[#66A5FF] flex items-center justify-center bg-blue_primary rounded-2xl text-white py-[11px] px-[22px] max-w-[188px] w-full text-base leading-[19px] font-normal tracking-[0.01em]', {
						'cursor-not-allowed': loading || isDisabled,
						'cursor-pointer': !loading && !isDisabled
					})
				}
			>
                Save
			</Button>
		</div>
	);
};

export default SaveBtn;