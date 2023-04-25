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

export {
	useRoomCreationCurrentStage,
	useRoomCreationStageComplete
};