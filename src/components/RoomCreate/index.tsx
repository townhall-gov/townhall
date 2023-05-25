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
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';

const RoomCreate = () => {
	const dispatch = useDispatch();
	const { isLoggedIn } = useAuthActionsCheck();
	useEffect(() => {
		dispatch(roomsActions.setRoomCreationStage(ERoomCreationStage.GETTING_STARTED));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (!isLoggedIn) {
		return (
			<section className='flex flex-col gap-5 justify-center items-center h-full'>
				<p className='text-green_primary font-bold text-xl'>
					You need to connect your wallet first for creating Room.
				</p>
				<button
					onClick={() => {
						dispatch(modalActions.setModal({
							contentType: EContentType.CONNECT_WALLET,
							footerType: EFooterType.NONE,
							open: true,
							titleType: ETitleType.CONNECT_WALLET
						}));
					}}
					className='outline-none border-none rounded-md bg-blue_primary px-8 py-2 text-medium text-base text-white font-medium cursor-pointer'
				>
					Connect Wallet
				</button>
			</section>
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