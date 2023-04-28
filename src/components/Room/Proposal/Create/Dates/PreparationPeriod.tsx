// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import React, { FC } from 'react';
import { useProposalCreation } from '~src/redux/room/selectors';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
interface IPreparationPeriodProps {
	isDisabled?: boolean;
}

const PreparationPeriod: FC<IPreparationPeriodProps> = (props) => {
	const { isDisabled } = props;
	const proposalCreation = useProposalCreation();
	const dispatch = useDispatch();

	const disabledDate = (current: dayjs.Dayjs) => {
		return current.isBefore(dayjs(proposalCreation.start_date).startOf('day')) || current.isAfter(dayjs(proposalCreation.end_date).endOf('day'));
	};

	const disabledTime = (current: dayjs.Dayjs | null) => {
		if (!current) return {
			disabledHours: () => [],
			disabledMinutes: () => [],
			disabledSeconds: () => []
		};
		const startDate = dayjs(proposalCreation.start_date);
		const endDate = dayjs(proposalCreation.end_date);
		let hours = Array.from({ length: 24 }, (_, hour) => hour);
		let minutes = Array.from({ length: 60 }, (_, hour) => hour);
		let seconds = Array.from({ length: 60 }, (_, hour) => hour);
		hours = hours.filter((hour) => {
			if (current.isSame(startDate, 'day')) {
				return hour < startDate.hour();
			}
			if (current.isSame(endDate, 'day')) {
				return hour > endDate.hour();
			}
			return false;
		});
		minutes = minutes.filter((minute) => {
			if (current.isSame(startDate, 'day') && current.isSame(startDate, 'hour')) {
				return minute < startDate.minute();
			}
			if (current.isSame(endDate, 'day') && current.isSame(endDate, 'hour')) {
				return minute > endDate.minute();
			}
			return false;
		});
		seconds = seconds.filter((second) => {
			if (current.isSame(startDate, 'day') && current.isSame(startDate, 'hour') && current.isSame(startDate, 'minute')) {
				return second <= startDate.second();
			}
			if (current.isSame(endDate, 'day') && current.isSame(endDate, 'hour') && current.isSame(endDate, 'minute')) {
				return second >= endDate.second();
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
			<p className='grid grid-cols-2 max-w-[400px] text-white font-medium text-sm m-0 mb-2 px-3'>
				Preparation Period:
			</p>
			<div>
				<DatePicker
					onChange={(value) => {
						dispatch(roomActions.setProposalCreation_Field({
							key: 'preparation_period',
							value: value?.toISOString() || null
						}));
					}}
					disabled={!(proposalCreation.start_date && proposalCreation.end_date) || isDisabled}
					disabledDate={disabledDate}
					disabledTime={disabledTime}
					// Preparation Period class is for error validation highlighting
					className='bg-transparent py-2 border border-solid border-blue_primary text-white preparation_period'
					placeholder='Preparation Period'
					showTime
				/>
			</div>
		</div>
	);
};

export default PreparationPeriod;