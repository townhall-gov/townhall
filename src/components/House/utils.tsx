// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EHouseStage } from '~src/redux/house/@types';
import { DiamondIcon, DiscussionIcon, HouseIcon, PlusSignSquareIcon, SettingsIcon } from '~src/ui-components/CustomIcons';

export const timeline = [
	{
		icon: <DiamondIcon className='text-transparent stroke-white' />,
		stage: EHouseStage.PROPOSALS,
		title: 'Proposals'
	},
	{
		icon: <DiscussionIcon className='text-transparent stroke-white' />,
		stage: EHouseStage.DISCUSSIONS,
		title: 'Discussions'
	},
	{
		icon: <HouseIcon className='text-white' />,
		stage: EHouseStage.ROOMS,
		title: 'Rooms'
	},
	{
		icon: <PlusSignSquareIcon className='text-transparent stroke-white' />,
		stage: EHouseStage.NEW_PROPOSAL,
		title: 'New Proposal'
	},
	{
		icon: <SettingsIcon className='' />,
		stage: EHouseStage.SETTINGS,
		title: 'Settings'
	}
];

export const getTimelineUrl = (stage: EHouseStage) => {
	switch(stage) {
	case EHouseStage.PROPOSALS:
		return '/proposals';
	case EHouseStage.DISCUSSIONS:
		return '/discussions';
	case EHouseStage.ROOMS:
		return '/rooms';
	case EHouseStage.NEW_PROPOSAL:
		return '/proposal/create';
	case EHouseStage.SETTINGS:
		return '/settings';
	}
};