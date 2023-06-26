// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import Timestamp from './Timestamp';
import Vote from './Vote';
import PostLinking from './PostLink';
import VotingTimer from './VotingTimer';
import { useProposalSelector } from '~src/redux/selectors';
import dayjs from 'dayjs';

interface ISidebarProps {
    className?: string;
}

const Sidebar: FC<ISidebarProps> = (props) => {
	const { className } = props;
	const { proposal } = useProposalSelector();
	const [startDate,setStartDate]=useState<any>();
	useEffect(()=>{
		if(proposal)
		{
			const { start_date }=proposal;
			setStartDate(dayjs(start_date));
		}
	},[]);
	return (
		<div className={classNames('flex flex-col gap-y-6 sticky top-6 min-w-[350px]', className)}>
			<PostLinking />
			<Vote />
			<Timestamp />
			{ startDate?.isAfter(dayjs())? <VotingTimer /> : null }
		</div>
	);
};

export default Sidebar;