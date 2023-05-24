// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useProfileJoinedRooms } from '~src/redux/profile/selectors';
import JoinedRoomList from './List';

const JoinedRoom = () => {
	const joinedRooms = useProfileJoinedRooms();
	return (
		<article>
			{
				joinedRooms.length > 0?
					<JoinedRoomList joinedRooms={joinedRooms} />
					: (
						<p
							className='m-0 p-0 font-normal text-xl leading-6 text-grey_primary'
						>
                            Joined Rooms will be shown here.
						</p>
					)
			}
		</article>
	);
};

export default JoinedRoom;