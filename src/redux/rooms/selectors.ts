// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useRoomsSelector } from '~src/redux/selectors';
import { ERoomCreationStage } from './@types';
import roomCreationValidation from './validation';
import { timeline } from '~src/components/RoomCreate/utils';

const useRoomCreationCurrentStage = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.currentStage;
};

const useRoomCreationStageComplete = (stage: ERoomCreationStage) => {
	const roomCreation = useRoomCreation();
	const error = roomCreationValidation?.[stage]?.(roomCreation);
	return (error? (Object.values(error).length === 0 ? true : false): false);
};

const useIsAllRoomCreationStageCompleteBeforeThisStage = (stage: ERoomCreationStage) => {
	let isError = false;
	const roomCreation = useRoomCreation();
	for(let i = 0; i < timeline.length; i++) {
		const item = timeline[i];
		if (item.stage === stage) {
			break;
		}
		const errors = roomCreationValidation?.[item.stage]?.(roomCreation);
		if (Object.values(errors).length > 0) {
			isError = true;
			break;
		}
	}
	return !isError;
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
	useRoomCreation,
	useIsAllRoomCreationStageCompleteBeforeThisStage
};