// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { ERoomCreationStage } from '~src/redux/rooms/@types';
import { useRoomCreationCurrentStage } from '~src/redux/rooms/selectors';

import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import TimelineCardBtn from '~src/ui-components/TimelineCardBtn';
interface ITimelineCardProps {
    icon: JSX.Element;
    title: string;
	stage: ERoomCreationStage;
}

const TimelineCard: FC<ITimelineCardProps> = (props) => {
	const { icon, stage, title } = props;
	const roomCreationCurrentStage = useRoomCreationCurrentStage();
	const dispatch = useDispatch();
	return (
		<TimelineCardBtn
			icon={icon}
			title={title}
			isActiveStage={roomCreationCurrentStage === stage}
			onClick={() => {
				dispatch(roomsActions.setRoomCreationStage(stage));
			}}
		/>
	);
};
export default TimelineCard;