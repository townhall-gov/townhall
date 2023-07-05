// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import EmptyHouse from '~src/components/Houses/EmptyHouse';
import Room from '~src/components/Houses/Rooms/Room';
import { useHouseSelector } from '~src/redux/selectors';

interface IRoomsProps {}

const Rooms: FC<IRoomsProps> = () => {
	const { houseRooms } = useHouseSelector();
	if (!houseRooms || !Array.isArray(houseRooms) || !houseRooms.length) {
		return <EmptyHouse />;
	}
	return (
		<section className='flex items-center flex-wrap gap-7'>
			{
				houseRooms.map((room, index) => {
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