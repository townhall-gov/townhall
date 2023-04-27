// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';

const { RangePicker } = DatePicker;

const StartEndDate = () => {
	const dispatch = useDispatch();
	return (
		<div>
			<p className='grid grid-cols-2 max-w-[400px] text-white font-medium text-sm m-0 mb-2'>
				<span className='px-3'>Start Date:</span>
				<span className='px-2'>End Date:</span>
			</p>
			<RangePicker
				onCalendarChange={(dates) => {
					if (dates && Array.isArray(dates) && dates.length === 2) {
						console.log(dates);
						dispatch(roomActions.setProposalCreation_Field({
							key: 'start_date',
							value: dates[0]?.toISOString() || null
						}));
						dispatch(roomActions.setProposalCreation_Field({
							key: 'end_date',
							value: dates[1]?.toISOString() || null
						}));
					}
				}}
				className='bg-transparent py-2 border border-solid border-blue_primary text-white'
				showTime
			/>
		</div>
	);
};

export default StartEndDate;