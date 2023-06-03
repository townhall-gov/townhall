// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect } from 'react';
import MinTokenToCreateProposal from './MinTokenToCreateProposal';
import { useProfileSelector, useRoomSelector } from '~src/redux/selectors';
import SaveBtn from './SaveBtn';

const RoomSettings = () => {
	const { user } = useProfileSelector();
	const { room } = useRoomSelector();
	const [isDisabled, setIsDisabled] = React.useState(false);
	useEffect(() => {
		if (room?.creator_details?.address && user?.address) {
			setIsDisabled(room?.creator_details?.address !== user?.address);
		}
	}, [room?.creator_details?.address, user?.address]);
	return (
		<div className='h-full'>
			<MinTokenToCreateProposal
				isDisabled={isDisabled}
			/>

			{
				!isDisabled?
					<>
						<SaveBtn
							isDisabled={isDisabled}
						/>
					</>
					: null
			}
		</div>
	);
};

export default RoomSettings;