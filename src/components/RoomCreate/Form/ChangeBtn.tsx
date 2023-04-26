// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useRoomCreation, useRoomCreationCurrentStage } from '~src/redux/rooms/selectors';
import { getNextCreationStage } from '../utils';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { ERoomCreationStage } from '~src/redux/rooms/@types';
import roomCreationValidation from '~src/redux/rooms/validation';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';

const StageChangeBtn = () => {
	const roomCreationCurrentStage = useRoomCreationCurrentStage();
	const roomCreation = useRoomCreation();
	const nextCreationStage = getNextCreationStage(roomCreationCurrentStage);
	const dispatch = useDispatch();
	return (
		<button
			onClick={() => {
				if (nextCreationStage) {
					dispatch(roomsActions.setRoomCreationStage(nextCreationStage.stage));
				} else {
					let isError = false;
					Object.values(ERoomCreationStage).some((stage) => {
						const error = roomCreationValidation?.[stage]?.(roomCreation);
						if (error) {
							isError = true;
							dispatch(notificationActions.send({
								message: error,
								status: ENotificationStatus.ERROR,
								title: 'Validation Error'
							}));
							dispatch(roomsActions.setRoomCreationStage(stage));
							return true;
						}
						return false;
					});
					if (!isError) {
						(async () => {

						})();
					}
				}
			}}
			className='max-w-[200px] bg-blue_primary text-white py-[11px] px-[22px] rounded-2xl border border-solid border-blue_primary flex items-center justify-center cursor-pointer text-base leading-[19px] tracking-[0.01em]'
		>
			{nextCreationStage?.title || 'Submit'}
		</button>
	);
};

export default StageChangeBtn;