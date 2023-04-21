// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card, Dropdown } from 'antd';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { profileActions } from '~src/redux/profile';
import { IUser } from '~src/types/schema';
import Address from '~src/ui-components/Address';

interface IProfileBtnProps {
	user: IUser;
}

const ProfileBtn: FC<IProfileBtnProps> = (props) => {
	const { user } = props;
	const dispatch = useDispatch();
	return (
		<Dropdown
			trigger={['click']}
			className='outline-none rounded-2xl border-2 border-solid border-blue_primary flex items-center justify-center py-2 px-4 h-[40px] bg-transparent text-white font-light text-xl leading-[24px] cursor-pointer'
			dropdownRender={() => {
				return (
					<Card>
						<button
							onClick={() => {
								dispatch(profileActions.setUser(null));
							}}
							className='outline-none border-none text-blue_primary w-full bg-transparent hover:bg-grey_secondary cursor-pointer rounded-md py-1 px-3 text-base font-medium'
						>
							Logout
						</button>
					</Card>
				);
			}}
		>
			<div className='flex items-center justify-center m-0 p-0'>
				<Address address={user?.address} addressMaxLength={14} addressClassName='font-light text-base leading-6' ethIdenticonSize={24} identiconSize={24} />
			</div>
		</Dropdown>
	);
};

export default ProfileBtn;