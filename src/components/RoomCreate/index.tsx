// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import Timeline from './Timeline';
import Form from './Form';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { ERoomCreationStage } from '~src/redux/rooms/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import JoinTownhall from '~src/ui-components/JoinTownhall';

const RoomCreate = () => {
	const dispatch = useDispatch();
	const { isLoggedIn } = useAuthActionsCheck();
	useEffect(() => {
		dispatch(roomsActions.setRoomCreationStage(ERoomCreationStage.GETTING_STARTED));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (!isLoggedIn) {
		return (
			<JoinTownhall description='Join Townhall to Create a Room.' />
		);
	}
	return (
		<section className='flex gap-x-5'>
			<Timeline />
			<Form />
		</section>
	);
};

export default RoomCreate;