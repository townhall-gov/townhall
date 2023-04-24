// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useSelector } from 'react-redux';
import { TAppState } from '../store';
import { IProfileStore } from './@types';

const useIsLoggedIn = () => {
	const { user } = useSelector<TAppState, IProfileStore>((state) => state.profile);
	return !!(user && user.address);
};

const useProfileIsRoomJoined = (houseId: string, roomId: string) => {
	const { user } = useSelector<TAppState, IProfileStore>((state) => state.profile);
	if (user && user.joined_houses && Array.isArray(user.joined_houses)) {
		const house = user.joined_houses.find((house) => house.house_id === houseId);
		if (house && Array.isArray(house.joined_rooms)) {
			return !!(house.joined_rooms.find((room) => room.room_id === roomId));
		}
	}
	return false;
};

export {
	useIsLoggedIn,
	useProfileIsRoomJoined
};