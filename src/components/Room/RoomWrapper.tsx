// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect } from 'react';
import { ERoomStage } from '~src/redux/room/@types';
import { useRoomCurrentStage } from '~src/redux/room/selectors';
import CreateProposal from './Proposal/Create';
import Proposals from './Proposals';
import RoomSettings from './Settings';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';

const RoomWrapper = () => {
	const dispatch = useDispatch();
	const currentStage = useRoomCurrentStage();
	const router = useRouter();
	useEffect(() => {
		if (router.pathname.endsWith('/proposal/create')) {
			dispatch(roomActions.setCurrentStage(ERoomStage.NEW_PROPOSAL));
		} else if (router.pathname.endsWith('/settings')) {
			dispatch(roomActions.setCurrentStage(ERoomStage.SETTINGS));
		} else if (router.pathname.endsWith('/proposals')) {
			dispatch(roomActions.setCurrentStage(ERoomStage.PROPOSALS));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className='flex-1'>
			{
				(() => {
					switch(currentStage){
					case ERoomStage.PROPOSALS:
						return <Proposals />;
					case ERoomStage.NEW_PROPOSAL:
						return <CreateProposal />;
					case ERoomStage.SETTINGS:
						return <RoomSettings />;
					default:
						return null;
					}
				})()
			}
		</div>
	);
};

export default RoomWrapper;