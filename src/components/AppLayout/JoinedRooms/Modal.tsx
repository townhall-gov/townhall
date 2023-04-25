// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { useProfileJoinedRooms } from '~src/redux/profile/selectors';
import { KusamaIcon } from '~src/ui-components/CustomIcons';

interface IJoinedRoomsModalTitleProps {}
export const JoinedRoomsModalTitle: FC<IJoinedRoomsModalTitleProps> = () => {
	return <>Joined Rooms</>;
};

const JoinedRoomsModalContent = () => {
	const joinedRooms = useProfileJoinedRooms();
	return (
		<section className='flex items-center justify-center mt-5'>
			{
				joinedRooms.map((joinedRoom, index) => {
					return (
						<article title={joinedRoom.room_id} key={index} className='flex items-center justify-center text-[45px] w-16 h-16 bg-white rounded-2xl'>
							<KusamaIcon />
						</article>
					);
				})
			}
		</section>
	);
};

export default JoinedRoomsModalContent;