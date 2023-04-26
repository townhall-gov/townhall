// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContactPageIcon, EarthIcon, RocketLaunchIcon, HolidayVillageIcon, DevicesIcon } from '~src/ui-components/CustomIcons';
import { ERoomCreationStage } from '~src/redux/rooms/@types';

export const timeline = [
	{
		icon: <RocketLaunchIcon />,
		stage: ERoomCreationStage.GETTING_STARTED,
		title: 'Getting Started'
	},
	{
		icon: <HolidayVillageIcon />,
		stage: ERoomCreationStage.SELECT_HOUSE,
		title: 'Select House'
	},
	{
		icon: <DevicesIcon />,
		stage: ERoomCreationStage.ROOM_DETAILS,
		title: 'Room Details'
	},
	{
		icon: <ContactPageIcon />,
		stage: ERoomCreationStage.CREATOR_DETAILS,
		title: 'Creator Details'
	},
	{
		icon: <EarthIcon />,
		stage: ERoomCreationStage.ROOM_SOCIALS,
		title: 'Room Socials'
	}
];

const getStageTimelineField = (stage: ERoomCreationStage) => {
	const field = timeline.find((item) => item.stage === stage);
	return field;
};

const getStageTimelineIndex = (stage: ERoomCreationStage) => {
	const index = timeline.findIndex((item) => item.stage === stage);
	return index;
};

const getNextCreationStage = (stage: ERoomCreationStage) => {
	const index = getStageTimelineIndex(stage);
	if (index < timeline.length - 1) {
		return timeline?.[index + 1];
	}
};

export {
	getStageTimelineField,
	getStageTimelineIndex,
	getNextCreationStage
};