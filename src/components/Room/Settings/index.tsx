// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect } from 'react';
import { useProfileSelector, useRoomSelector } from '~src/redux/selectors';
import SaveBtn from './SaveBtn';
import Strategies from './Strategies';
const RoomSettings = () => {
	const { user } = useProfileSelector();
	const { room, loading } = useRoomSelector();
	const [isDisabled, setIsDisabled] = React.useState(true);
	useEffect(() => {
		let isUserAdmin = false;
		if (room?.admins && Array.isArray(room?.admins) && room?.admins.length > 0 && user?.address) {
			isUserAdmin = room?.admins.some((admin) => {
				if (admin.addresses && Array.isArray(admin.addresses) && admin.addresses.length > 0) {
					return admin.addresses.some((address) => address === user.address);
				} else {
					return false;
				}
			});
		}
		if (!isUserAdmin && room?.creator_details?.address && user?.address) {
			isUserAdmin = room?.creator_details?.address === user?.address;
		}
		setIsDisabled(!isUserAdmin);
	}, [room?.creator_details?.address, room?.admins, user?.address]);
	return (
		<div className='h-full flex flex-col gap-y-5 w-full'>
			<Strategies
				isDisabled={isDisabled || loading}
			/>

			{
				!isDisabled?
					<div className='flex items-center justify-end'>
						<SaveBtn
							isDisabled={isDisabled || loading}
						/>
					</div>
					: null
			}
		</div>
	);
};

export default RoomSettings;