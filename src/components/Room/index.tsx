// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import RoomSidebar from './Sidebar';
import RoomWrapper from './RoomWrapper';

const Room = () => {
	return (
		<section className='flex gap-x-7'>
			<RoomSidebar />
			<RoomWrapper />
		</section>
	);
};

export default Room;