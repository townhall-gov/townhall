// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { IJoinedRoom } from '~src/types/schema';
import ModalTrigger from './ModalTrigger';
import { KusamaIcon } from '~src/ui-components/CustomIcons';

interface IJoinedRoomListProps {
    joinedRooms: IJoinedRoom[];
}
const JoinedRoomList: FC<IJoinedRoomListProps> = (props) => {
	const { joinedRooms } = props;
	const totalShowing = 6;
	return (
		<div className='m-0 p-0 leading-none flex items-center gap-x-2'>
			{
				joinedRooms.slice(0, totalShowing).map((joinedRoom, index) => {
					return (
						<article title={joinedRoom.room_id} key={index} className='flex items-center justify-center text-[45px]'>
							<KusamaIcon />
						</article>
					);
				})
			}
			{
				(joinedRooms.length - totalShowing) > 0?
					<ModalTrigger total={(joinedRooms.length - totalShowing)} />
					: null
			}
		</div>
	);
};

export default JoinedRoomList;