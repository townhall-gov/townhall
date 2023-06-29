// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect } from 'react';
import { useHouseSelector, useProfileSelector } from '~src/redux/selectors';
import SaveBtn from './SaveBtn';
import MinTokenToCreateRoom from './MinTokenToCreateRoom';

const HouseSettings = () => {
	const { user } = useProfileSelector();
	const { house, loading, houseSettings } = useHouseSelector();
	const [isDisabled, setIsDisabled] = React.useState(true);

	useEffect(() => {
		if (house?.admins && Array.isArray(house?.admins) && house?.admins.length > 0 && user?.address) {
			const isUserAdmin = house?.admins.some((admin) => {
				if (admin.addresses && Array.isArray(admin.addresses) && admin.addresses.length > 0) {
					return admin.addresses.some((address) => address === user.address);
				} else {
					return false;
				}
			});
			setIsDisabled(!isUserAdmin);
		} else {
			setIsDisabled(true);
		}
	}, [house?.admins, user?.address]);

	return (
		<div className='h-full flex flex-col gap-y-5 w-full'>
			<MinTokenToCreateRoom
				isDisabled={isDisabled || loading}
				min_token_to_create_room={houseSettings?.min_token_to_create_room || ''}
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

export default HouseSettings;