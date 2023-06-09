// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Timeline from './Timeline';
import RoomCard from './RoomCard';

const RoomSidebar = () => {
	return (
		<div className='flex flex-col gap-y-[18px]'>
			<RoomCard />
			<Timeline />
		</div>
	);
};

export default RoomSidebar;