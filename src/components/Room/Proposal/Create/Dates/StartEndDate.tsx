// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';

const { RangePicker } = DatePicker;

interface IStartEndDateProps {
	isDisabled?: boolean;
}

const StartEndDate: FC<IStartEndDateProps> = (props) => {
	const dispatch = useDispatch();
	const { isDisabled } = props;

	const disabledDate = (current: dayjs.Dayjs) => {
		return current.isBefore(dayjs());
	};
	const disabledTime = (current: dayjs.Dayjs | null) => {
		if (!current) return {
			disabledHours: () => [],
			disabledMinutes: () => [],
			disabledSeconds: () => []
		};
		let hours = Array.from({ length: 24 }, (_, hour) => hour);
		let minutes = Array.from({ length: 60 }, (_, hour) => hour);
		let seconds = Array.from({ length: 60 }, (_, hour) => hour);
		const now = dayjs();
		hours = hours.filter((hour) => {
			if (current.isSame(now, 'day')) {
				return hour < now.hour();
			}
			return false;
		});
		minutes = minutes.filter((minute) => {
			if (current.isSame(now, 'day') && current.isSame(now, 'hour')) {
				return minute < now.minute();
			}
			return false;
		});
		seconds = seconds.filter((second) => {
			if (current.isSame(now, 'day') && current.isSame(now, 'hour') && current.isSame(now, 'minute')) {
				return second <= now.second();
			}
			return false;
		});

		return {
			disabledHours: () => hours,
			disabledMinutes: () => minutes,
			disabledSeconds: () => seconds
		};
	};
	return (
		<div>
			<p className='grid grid-cols-2 max-w-[400px] text-white font-medium text-sm m-0 mb-2'>
				<span className='px-3'>Start Date:</span>
				<span className='px-2'>End Date:</span>
			</p>
			<RangePicker
				disabled={isDisabled}
				disabledDate={disabledDate}
				disabledTime={disabledTime}
				onCalendarChange={(dates) => {
					if (dates && Array.isArray(dates) && dates.length === 2) {
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
				className='bg-transparent py-2 border border-solid border-blue_primary text-white start_date end_date'
				showTime
			/>
		</div>
	);
};

export default StartEndDate;