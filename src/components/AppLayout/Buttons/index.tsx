// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import ConnectWalletBtn from './ConnectWallet';
import MenuBtn from '../MenuBtn';
import { useProfileSelector } from '~src/redux/selectors';
import ProfileBtn from './Profile';

const Buttons = () => {
	const { user } = useProfileSelector();
	return (
		<div className='flex items-center gap-x-2 py-[22px]'>
			{
				(user && user.address)
					? <ProfileBtn user={user} />
					: <ConnectWalletBtn />
			}
			<MenuBtn />
		</div>
	);
};

export default Buttons;