// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import RoomSidebar from './Sidebar';
import RoomWrapper from './RoomWrapper';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { ERoomStage } from '~src/redux/room/@types';
import { useRoomCurrentStage } from '~src/redux/room/selectors';

const Room = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const currentStage = useRoomCurrentStage();
	useEffect(() => {
		const { asPath } = router;
		if (asPath.endsWith('create')) {
			if (currentStage !== ERoomStage.NEW_PROPOSAL) {
				dispatch(roomActions.setCurrentStage(ERoomStage.NEW_PROPOSAL));
			}
		} else if (asPath.endsWith('proposals')) {
			if (currentStage !== ERoomStage.PROPOSALS) {
				dispatch(roomActions.setCurrentStage(ERoomStage.PROPOSALS));
			}
		} else if (asPath.endsWith('settings')) {
			if (currentStage !== ERoomStage.SETTINGS) {
				dispatch(roomActions.setCurrentStage(ERoomStage.SETTINGS));
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<section className='flex gap-x-7'>
			<RoomSidebar />
			<RoomWrapper />
		</section>
	);
};

export default Room;