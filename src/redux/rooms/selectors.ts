// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useRoomsSelector } from '~src/redux/selectors';
import { ERoomCreationStage } from './@types';

const useRoomCreationCurrentStage = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.currentStage;
};

const useRoomCreationStageComplete = (stage: ERoomCreationStage) => {
	if (ERoomCreationStage.CREATOR_DETAILS === stage) {
		return true;
	}
	return false;
};

const useRoomCreation_House = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.select_house;
};

const useRoomCreation_ProjectDetails = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.project_details;
};

const useRoomCreation_CreatorDetails = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.creator_details;
};

const useRoomCreation_ProjectSocials = () => {
	const rooms = useRoomsSelector();
	return rooms.roomCreation?.project_socials;
};

export {
	useRoomCreationCurrentStage,
	useRoomCreationStageComplete,
	useRoomCreation_House,
	useRoomCreation_ProjectDetails,
	useRoomCreation_CreatorDetails,
	useRoomCreation_ProjectSocials
};