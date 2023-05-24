// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useRouter } from 'next/router';
import { IRoomQuery } from 'pages/api/room';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Room from '~src/components/Houses/Rooms/Room';
import { roomActions } from '~src/redux/room';
import { useRoomSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { IRoom } from '~src/types/schema';

const RoomCard = () => {
	const router = useRouter();
	const { room } = useRoomSelector();
	const dispatch = useDispatch();
	useEffect(() => {
		if (!room) {
			(async () => {
				const { query } = router;
				if (!query || !query.house_id || !query.room_id) {
					return;
				}
				try {
					// TODO: we need to handle this error
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { data, error } = await api.get<IRoom, IRoomQuery>('room', {
						house_id: String(query.house_id),
						room_id: String(query.room_id)
					});
					if (data) {
						dispatch(roomActions.setRoom(data));
					}
				} catch (error) {
					// TODO: we need to handle this error
					// console.log(error);
				}
			})();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [room, router]);
	return (
		<>
			{
				room?
					<div>
						<Room
							room={room}
						/>
					</div>
					: null
			}
		</>
	);
};

export default RoomCard;