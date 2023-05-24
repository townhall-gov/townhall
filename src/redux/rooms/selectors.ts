// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useRoomsSelector } from '~src/redux/selectors';
import { ERoomCreationStage } from './@types';
import roomCreationValidation from './validation';

const useRoomCreationCurrentStage = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.currentStage;
};

const useRoomCreationStageComplete = (stage: ERoomCreationStage) => {
	const roomCreation = useRoomCreation();
	return roomCreationValidation?.[stage]?.(roomCreation);
};

const useRoomCreation = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation;
};

const useRoomCreation_House = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.select_house;
};

const useRoomCreation_RoomDetails = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.room_details;
};

const useRoomCreation_CreatorDetails = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.creator_details;
};

const useRoomCreation_RoomSocials = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.room_socials;
};

export {
	useRoomCreationCurrentStage,
	useRoomCreationStageComplete,
	useRoomCreation_House,
	useRoomCreation_RoomDetails,
	useRoomCreation_CreatorDetails,
	useRoomCreation_RoomSocials,
	useRoomCreation
};