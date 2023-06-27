// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button } from 'antd';
import classNames from 'classnames';
import { IHouseSettingsResponse, IHouseSettingsBody } from 'pages/api/auth/actions/houseSettings';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { houseActions } from '~src/redux/house';
import { useHouseSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import getErrorMessage from '~src/utils/getErrorMessage';

interface ISaveBtnProps {
    isDisabled?: boolean;
}

const SaveBtn: FC<ISaveBtnProps> = (props) => {
	const { isDisabled } = props;
	const { loading, house, houseSettings } = useHouseSelector();
	const { connectWallet, isLoggedIn } = useAuthActionsCheck();
	const dispatch = useDispatch();
	const onSave = async () => {
		if (loading) return;
		if (!isLoggedIn) {
			connectWallet();
			return;
		}
		if (isDisabled) {
			dispatch(notificationActions.send({
				message: 'You can\'t change House setting you are not the Admin of this House.',
				status: ENotificationStatus.ERROR,
				title: 'Error!'
			}));
			return;
		}
		try {
			if (house && house.id) {
				dispatch(houseActions.setLoading(true));
				const { data, error } = await api.post<IHouseSettingsResponse, IHouseSettingsBody>('auth/actions/houseSettings', {
					houseId: house.id,
					houseSettings: houseSettings
				});
				if (error) {
					dispatch(houseActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data || !data.updatedHouse) {
					const error = 'Something went wrong, unable to update HOuse settings.';
					dispatch(houseActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					const { updatedHouse } = data;
					dispatch(houseActions.setHouse(updatedHouse));
					dispatch(notificationActions.send({
						message: 'House settings updated successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
				}
				dispatch(houseActions.setLoading(false));
			}

		} catch (error) {
			dispatch(houseActions.setLoading(false));
			const err = getErrorMessage(error);
			dispatch(houseActions.setError(err));
			dispatch(notificationActions.send({
				message: err,
				status: ENotificationStatus.ERROR,
				title: 'Error!'
			}));
		}
	};
	return (
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
	);
};

export default SaveBtn;