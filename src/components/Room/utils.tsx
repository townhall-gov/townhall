// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ERoomStage } from '~src/redux/room/@types';
import { DiamondIcon, PlusSignSquareIcon, SettingsIcon } from '~src/ui-components/CustomIcons';

export const timeline = [
	{
		icon: <DiamondIcon className='text-transparent stroke-white' />,
		stage: ERoomStage.PROPOSALS,
		title: 'Proposals'
	},
	{
		icon: <PlusSignSquareIcon className='text-transparent stroke-white' />,
		stage: ERoomStage.NEW_PROPOSAL,
		title: 'New Proposal'
	},
	{
		icon: <SettingsIcon className='' />,
		stage: ERoomStage.SETTINGS,
		title: 'Settings'
	}
];

export const getTimelineUrl = (stage: ERoomStage) => {
	switch(stage) {
	case ERoomStage.PROPOSALS:
		return '/proposals';
	case ERoomStage.NEW_PROPOSAL:
		return '/proposal/create';
	case ERoomStage.SETTINGS:
		return '/settings';
	}
};