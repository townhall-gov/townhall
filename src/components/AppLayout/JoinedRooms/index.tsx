// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { useProfileJoinedRooms } from '~src/redux/profile/selectors';
import JoinedRoomList from './List';

interface IJoinedRoomProps {
	totalShowing:number;
}
const JoinedRoom: FC<IJoinedRoomProps> = (props) => {
	const joinedRooms = useProfileJoinedRooms();
	const { totalShowing } = props;
	return (
		<>
			{
				joinedRooms && Array.isArray(joinedRooms) && joinedRooms.length > 0 &&
					<JoinedRoomList joinedRooms={joinedRooms} totalShowing={totalShowing} />
			}
		</>
	);
};

export default JoinedRoom;