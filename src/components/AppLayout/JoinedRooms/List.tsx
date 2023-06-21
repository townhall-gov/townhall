// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC, useEffect, useState } from 'react';
import { Image } from 'antd';
import { IJoinedRoom } from '~src/types/schema';
import ModalTrigger from './ModalTrigger';
import DefaultNameImage from '~src/ui-components/DefaultNameImage';

interface IJoinedRoomListProps {
    joinedRooms: IJoinedRoom[];
}
const JoinedRoomList: FC<IJoinedRoomListProps> = (props) => {
	const { joinedRooms } = props;
	const [totalShowing, setTotalShowing] = useState(2);
	useEffect(() => {
		const updateTotalShowing = () => {
			if (window.innerWidth < 770) {
				setTotalShowing(4);
			}
			if (window.innerWidth > 770) {
				setTotalShowing(2);
			}
		};
		window.addEventListener('resize', updateTotalShowing);
		return () => {
			window.removeEventListener('resize', updateTotalShowing);
		};
	}, [totalShowing]);
	return (
		<div className='m-0 p-0 mb-2 leading-none flex items-center gap-x-4 flex-col'>
			{
				joinedRooms.slice(0, totalShowing).map((joinedRoom, index) => {
					if (!joinedRoom || !joinedRoom.id) return null;
					return (
						<article title={joinedRoom.id} key={index} className='flex items-center m-2 justify-center text-[45px]'>
							{
								joinedRoom.logo?
									<Image preview={false} width={45} height={45} className='rounded-full' src={joinedRoom.logo} alt='room logo' />
									: <DefaultNameImage
										name={joinedRoom.id}
										className='w-[45px] h-[45px]'
									/>
							}
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