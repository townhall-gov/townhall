// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IJoinedRoom } from '~src/types/schema';
import { useProfileSelector } from '../selectors';

const useIsLoggedIn = () => {
	const { user } = useProfileSelector();
	return !!(user && user.address);
};

const useProfileIsRoomJoined = (houseId: string, roomId: string) => {
	const { user } = useProfileSelector();
	if (user && user.joined_houses && Array.isArray(user.joined_houses)) {
		const house = user.joined_houses.find((house) => house.house_id === houseId);
		if (house && Array.isArray(house.joined_rooms)) {
			return !!(house.joined_rooms.find((room) => room.room_id === roomId));
		}
	}
	return false;
};

const useProfileJoinedRooms = () => {
	const joinedRooms: IJoinedRoom[] = [];
	const { user } = useProfileSelector();
	if (user && user.joined_houses && Array.isArray(user.joined_houses)) {
		user.joined_houses.forEach((joinedHouse) => {
			if (joinedHouse && joinedHouse.joined_rooms && Array.isArray(joinedHouse.joined_rooms)) {
				joinedHouse.joined_rooms.forEach((joinedRoom) => {
					if (joinedRoom) {
						joinedRooms.push(joinedRoom);
					}
				});
			}
		});
	}
	return joinedRooms;
};

export {
	useIsLoggedIn,
	useProfileIsRoomJoined,
	useProfileJoinedRooms
};