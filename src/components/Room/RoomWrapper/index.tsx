// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { ERoomStage } from '~src/redux/room/@types';
import { useRoomCurrentStage } from '~src/redux/room/selectors';
import CreateProposal from '../Proposal/Create';
import Proposals from '../Proposals';
import RoomSettings from '../Settings';
import { useRoomSelector } from '~src/redux/selectors';
import RoomAbout from './RoomAbout';
import Discussions from '../Discussions';
import { useRouter } from 'next/router';
import CreateDiscussion from '../Discussion/Create';

const RoomWrapper = () => {
	const currentStage = useRoomCurrentStage();
	const { proposals, discussions } = useRoomSelector();
	const { room } = useRoomSelector();
	const router = useRouter();
	if (!room) {
		return null;
	}
	const { asPath } = router;
	if (asPath.endsWith('discussion/create')) {
		return <CreateDiscussion />;
	}
	return (
		<div className='flex-1 flex flex-col gap-y-[21px]'>
			{
				![ERoomStage.NEW_PROPOSAL].includes(currentStage)?
					<section
						className='flex gap-x-[17.5px]'
					>
						<RoomAbout
							description={room.description}
							socials={room.socials}
						/>
					</section>
					: null
			}
			{
				(() => {
					switch(currentStage){
					case ERoomStage.PROPOSALS:
						return <Proposals proposals={proposals} />;
					case ERoomStage.NEW_PROPOSAL:
						return <CreateProposal />;
					case ERoomStage.SETTINGS:
						return <RoomSettings />;
					case ERoomStage.DISCUSSIONS:
						return <Discussions discussions={discussions} />;
					default:
						return null;
					}
				})()
			}
		</div>
	);
};

export default RoomWrapper;