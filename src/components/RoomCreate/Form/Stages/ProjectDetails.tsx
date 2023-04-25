// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { useRoomCreation_ProjectDetails } from '~src/redux/rooms/selectors';
import Input from './Input';

const ProjectDetails = () => {
	const projectDetails = useRoomCreation_ProjectDetails();
	const dispatch = useDispatch();
	return (
		<article>
			<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
				A Project Name is Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..
			</p>
			<div className='flex items-center mt-[28px]'>
				<Input
					value={projectDetails?.name || ''}
					onChange={(v) => {
						dispatch(roomsActions.setRoomCreation_ProjectDetails({
							...projectDetails,
							name: v
						}));
					}}
					type='text'
					placeholder='Project name'
				/>
			</div>
		</article>
	);
};

export default ProjectDetails;