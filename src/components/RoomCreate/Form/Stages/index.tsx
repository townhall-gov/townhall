// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { ERoomCreationStage } from '~src/redux/rooms/@types';
import { useRoomCreationCurrentStage } from '~src/redux/rooms/selectors';
import GettingStarted from './GettingStarted';
import SelectHouse from './SelectHouse';
import ProjectDetails from './ProjectDetails';
import CreatorDetails from './CreatorDetails';
import ProjectSocials from './ProjectSocials';

const Stages = () => {
	const stage = useRoomCreationCurrentStage();
	switch(stage) {
	case ERoomCreationStage.GETTING_STARTED:
		return <GettingStarted />;
	case ERoomCreationStage.SELECT_HOUSE:
		return <SelectHouse />;
	case ERoomCreationStage.PROJECT_DETAILS:
		return <ProjectDetails />;
	case ERoomCreationStage.CREATOR_DETAILS:
		return <CreatorDetails />;
	case ERoomCreationStage.PROJECT_SOCIALS:
		return <ProjectSocials />;
	default:
		return <></>;
	}
};

const RoomCreationStages = () => {
	return (
		<section>
			<Stages />
		</section>
	);
};

export default RoomCreationStages;