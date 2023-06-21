// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IJoinedRoom } from '~src/types/schema';
import { useProfileSelector } from '../selectors';
import { useDispatch } from 'react-redux';
import { modalActions } from '../modal';
import { EContentType, EFooterType, ETitleType } from '../modal/@types';
import { useRouter } from 'next/router';
import { notificationActions } from '../notification';
import { ENotificationStatus } from '../notification/@types';

const useIsLoggedIn = () => {
	const { user } = useProfileSelector();
	return !!(user && user.address);
};

const useIsJoinOrRemoveHouseId = (houseId: string) => {
	const { joinOrRemoveHouseIds } = useProfileSelector();
	if (joinOrRemoveHouseIds && Array.isArray(joinOrRemoveHouseIds)) {
		return !!(joinOrRemoveHouseIds.find((joinOrRemoveHouseId) => joinOrRemoveHouseId === houseId));
	}
	return false;
};

const useIsJoinOrRemoveRoomId = (roomId: string) => {
	const { joinOrRemoveRoomIds } = useProfileSelector();
	if (joinOrRemoveRoomIds && Array.isArray(joinOrRemoveRoomIds)) {
		return !!(joinOrRemoveRoomIds.find((joinOrRemoveRoomId) => joinOrRemoveRoomId === roomId));
	}
	return false;
};

const useProfileIsHouseJoined = (houseId: string) => {
	const { user } = useProfileSelector();
	if (user && user.joined_houses && Array.isArray(user.joined_houses)) {
		return !!(user.joined_houses.find((house) => house.house_id === houseId));
	}
	return false;
};

const useProfileIsRoomJoined = (houseId: string, roomId: string) => {
	const { user } = useProfileSelector();
	if (user && user.joined_houses && Array.isArray(user.joined_houses)) {
		const house = user.joined_houses.find((house) => house.house_id === houseId);
		if (house && Array.isArray(house.joined_rooms)) {
			return !!(house.joined_rooms.find((room) => room.id === roomId));
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
const useAuthActionsCheck = () => {
	const { user } = useProfileSelector();
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;
	const isRoomJoined = useProfileIsRoomJoined(String(query.house_id), String(query.room_id));
	const connectWallet = () => {
		dispatch(notificationActions.send({
			message: 'Please connect your wallet first.',
			status: ENotificationStatus.WARNING,
			title: 'Warning!'
		}));
		if (!user || !user.address) {
			dispatch(modalActions.setModal({
				contentType: EContentType.CONNECT_WALLET,
				footerType: EFooterType.NONE,
				open: true,
				titleType: ETitleType.CONNECT_WALLET
			}));
		}
	};
	const joinRoom = () => {
		dispatch(notificationActions.send({
			message: 'Please join room first.',
			status: ENotificationStatus.WARNING,
			title: 'Warning!'
		}));
		if (!isRoomJoined) {
			router.push(`/${query.house_id}/${query.room_id}/proposals`);
		}
	};
	return {
		connectWallet,
		isLoggedIn: !!(user && user.address),
		isRoomJoined,
		joinRoom
	};
};

export {
	useIsLoggedIn,
	useProfileIsRoomJoined,
	useProfileIsHouseJoined,
	useProfileJoinedRooms,
	useAuthActionsCheck,
	useIsJoinOrRemoveHouseId,
	useIsJoinOrRemoveRoomId
};