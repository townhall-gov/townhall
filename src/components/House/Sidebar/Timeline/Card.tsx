// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useDispatch } from 'react-redux';
import { houseActions } from '~src/redux/house';
import TimelineCardBtn from '~src/ui-components/TimelineCardBtn';
import { EHouseStage } from '~src/redux/house/@types';
import { useHouseCurrentStage } from '~src/redux/house/selectors';
import { FC } from 'react';
import { useRouter } from 'next/router';
import { getTimelineUrl } from '../../utils';

interface ITimelineCardProps {
    icon: JSX.Element;
    title: string;
	stage: EHouseStage;
}

const TimelineCard: FC<ITimelineCardProps> = (props) => {
	const { icon, stage, title } = props;
	const houseCurrentStage = useHouseCurrentStage();
	const dispatch = useDispatch();
	const router = useRouter();
	return (
		<TimelineCardBtn
			icon={icon}
			title={title}
			isActiveStage={houseCurrentStage === stage}
			onClick={() => {
				const { query } = router;
				let url = `/${query['house_id']}`;
				if ([EHouseStage.NEW_PROPOSAL, EHouseStage.DISCUSSIONS].includes(stage)) {
					url = `/${query['house_id']}/${query['house_id']}`;
				}
				router.push(url + getTimelineUrl(stage));
				dispatch(houseActions.setCurrentStage(stage));
			}}
		/>
	);
};
export default TimelineCard;