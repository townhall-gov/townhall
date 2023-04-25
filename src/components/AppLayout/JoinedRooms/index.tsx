// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { profileActions } from '~src/redux/profile';
import { useProfileJoinedRooms } from '~src/redux/profile/selectors';
import { useProfileSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { IJoinedHouse } from '~src/types/schema';
import JoinedRoomList from './List';

const JoinedRoom = () => {
	const { user } = useProfileSelector();
	const joinedRooms = useProfileJoinedRooms();
	const dispatch = useDispatch();

	useEffect(() => {
		if (user && user.address) {
			api.get<IJoinedHouse[], {}>('auth/data/joined-rooms', {}).then((res) => {
				if (res && res.data && Array.isArray(res.data)) {
					dispatch(profileActions.addJoinedRooms(res.data));
				}
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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