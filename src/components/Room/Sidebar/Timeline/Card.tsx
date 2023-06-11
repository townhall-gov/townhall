// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import TimelineCardBtn from '~src/ui-components/TimelineCardBtn';
import { ERoomStage } from '~src/redux/room/@types';
import { useRoomCurrentStage } from '~src/redux/room/selectors';
import { FC } from 'react';
import { useRouter } from 'next/router';
import { getTimelineUrl } from '../../utils';

interface ITimelineCardProps {
    icon: JSX.Element;
    title: string;
	stage: ERoomStage;
}

const TimelineCard: FC<ITimelineCardProps> = (props) => {
	const { icon, stage, title } = props;
	const roomCurrentStage = useRoomCurrentStage();
	const dispatch = useDispatch();
	const router = useRouter();
	return (
		<TimelineCardBtn
			icon={icon}
			title={title}
			isActiveStage={roomCurrentStage === stage}
			onClick={() => {
				const { query } = router;
				console.log(stage);
				router.push(`/${query['house_id']}/${query['room_id']}` + getTimelineUrl(stage));
				dispatch(roomActions.setCurrentStage(stage));
			}}
		/>
	);
};
export default TimelineCard;