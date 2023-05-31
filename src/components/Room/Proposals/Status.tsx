// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { FC } from 'react';

interface IStatusProps {
    end_at: Date;
    start_at: Date;
}

const Status: FC<IStatusProps> = (props) => {
	const { end_at, start_at } = props;
	const isClosed = dayjs().isAfter(end_at);
	const isActive = dayjs().isBetween(start_at, end_at);
	const isPending = dayjs().isBefore(start_at);
	return (
		<div className={
			classNames('rounded-l-2xl min-w-[90px] h-[25px] flex items-center justify-center -mr-[18.5px]', {
				'bg-green_primary': isActive,
				'bg-red_primary': isClosed,
				'bg-yellow_primary': isPending
			})
		}>
			{
				isClosed? 'Closed': isActive? 'Active': 'Pending'
			}
		</div>
	);
};

export default Status;