// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import TimelineCard from './Card';
import { timeline } from '../../utils';

const Timeline = () => {
	return (
		<aside className='flex flex-col gap-y-3'>
			{
				timeline.map((item, index) => {
					return (
						<TimelineCard key={index} {...item} />
					);
				})
			}
		</aside>
	);
};

export default Timeline;