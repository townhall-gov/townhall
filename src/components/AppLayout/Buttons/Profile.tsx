// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Dropdown, MenuProps } from 'antd';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { profileActions } from '~src/redux/profile';
import { deleteLocalStorageToken } from '~src/services/auth.service';
import { IUser } from '~src/types/schema';
import Address from '~src/ui-components/Address';

interface IProfileBtnProps {
	user: IUser;
}

const ProfileBtn: FC<IProfileBtnProps> = (props) => {
	const { user } = props;
	const dispatch = useDispatch();
	const items = [
		{
			key: 'logout',
			label: (
				<div
					className='text-white flex justify-center items-center gap-x-[6px] font-normal text-base leading-none'
				>
					Logout
				</div>

			)
		}
	];
	const handleEndpointChange: MenuProps['onClick'] = ({ key }) => {
		switch(key) {
		case 'logout': {
			dispatch(profileActions.setUser(null));
			deleteLocalStorageToken();
			dispatch(notificationActions.send({
				message: 'Logged out successfully.',
				status: ENotificationStatus.SUCCESS,
				title: 'Success'
			}));
		}
		}
	};
	return (
		<Dropdown
			trigger={['click']}
			className='outline-none rounded-2xl border-2 border-solid border-blue_primary flex items-center justify-center py-2 px-4 h-[40px] bg-transparent text-white font-light text-xl leading-[24px] cursor-pointer'
			menu={{ items, onClick: handleEndpointChange }}
		>
			<div className='flex items-center justify-center m-0 p-0'>
				<Address address={user?.address} addressMaxLength={14} addressClassName='font-light text-base leading-6' ethIdenticonSize={24} identiconSize={24} />
			</div>
		</Dropdown>
	);
};

export default ProfileBtn;