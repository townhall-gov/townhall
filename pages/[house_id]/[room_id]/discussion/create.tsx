// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CreateDiscussion from '~src/components/Room/Discussion/Create';
import RoomSidebar from '~src/components/Room/Sidebar';
import SEOHead from '~src/global/SEOHead';
import { roomActions } from '~src/redux/room';
import { ERoomStage } from '~src/redux/room/@types';
import { useRoomCurrentStage } from '~src/redux/room/selectors';
import { useRoomSelector } from '~src/redux/selectors';
import NoRoomFound from '~src/ui-components/NoRoomFound';

const CreateDiscussionPage = () => {
	const dispatch = useDispatch();
	const currentStage = useRoomCurrentStage();
	const router = useRouter();
	const { room } = useRoomSelector();
	const { query } = router;

	useEffect(() => {
		if (currentStage !== ERoomStage.DISCUSSIONS) {
			dispatch(roomActions.setCurrentStage(ERoomStage.DISCUSSIONS));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!room) {
		return <NoRoomFound />;
	}
	return (
		<>
			<SEOHead title={`Create a Discussion in Room ${query['room_id']} of House ${query['house_id']}`} />
			<section className='flex gap-x-7'>
				<RoomSidebar />
				<CreateDiscussion />
			</section>
		</>
	);
};

export default CreateDiscussionPage;