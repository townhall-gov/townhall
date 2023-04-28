// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import Room from './Room';
import { useRoomsSelector } from '~src/redux/selectors';

interface IRoomsProps {}

const Rooms: FC<IRoomsProps> = () => {
	const { rooms } = useRoomsSelector();
	if (!rooms) {
		return null;
	}
	return (
		<section className='flex items-center flex-wrap gap-7'>
			{
				rooms.map((room, index) => {
					return (
						<>
							<Room
								key={index}
								room={room}
							/>
						</>
					);
				})
			}
		</section>
	);
};

export default Rooms;