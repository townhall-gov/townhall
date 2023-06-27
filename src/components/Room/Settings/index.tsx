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
		if (room?.creator_details?.address && user?.address) {
			setIsDisabled(room?.creator_details?.address !== user?.address);
		} else {
			setIsDisabled(true);
		}
	}, [room?.creator_details?.address, user?.address]);
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