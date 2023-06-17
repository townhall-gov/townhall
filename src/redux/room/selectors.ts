// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useRoomSelector } from '../selectors';

const useRoomCurrentStage = () => {
	const room = useRoomSelector();
	return room.currentStage;
};

const useProposalCreation = () => {
	const room = useRoomSelector();
	return room.proposalCreation;
};

const useDiscussionCreation = () => {
	const room = useRoomSelector();
	return room.discussionCreation;
};

const useRoomSettings = () => {
	const room = useRoomSelector();
	return room.roomSettings;
};

export {
	useProposalCreation,
	useDiscussionCreation,
	useRoomCurrentStage,
	useRoomSettings
};