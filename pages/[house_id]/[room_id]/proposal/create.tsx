// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CreateProposal from '~src/components/Room/Proposal/Create';
import RoomSidebar from '~src/components/Room/Sidebar';
import SEOHead from '~src/global/SEOHead';
import { roomActions } from '~src/redux/room';
import { ERoomStage } from '~src/redux/room/@types';
import { useRoomCurrentStage } from '~src/redux/room/selectors';
import { useRoomSelector } from '~src/redux/selectors';

const CreateProposalPage = () => {
	const dispatch = useDispatch();
	const currentStage = useRoomCurrentStage();
	const router = useRouter();
	const { room } = useRoomSelector();
	const { query } = router;

	useEffect(() => {
		if (currentStage !== ERoomStage.NEW_PROPOSAL) {
			dispatch(roomActions.setCurrentStage(ERoomStage.NEW_PROPOSAL));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!room) {
		return null;
	}

	return (
		<>
			<SEOHead title={`Create a Proposal in Room ${query['room_id']} of House ${query['house_id']}`} />
			<section className='flex gap-x-7'>
				<RoomSidebar />
				<CreateProposal />
			</section>
		</>
	);
};

export default CreateProposalPage;