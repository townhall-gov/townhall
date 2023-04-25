// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { useRoomCreation_ProjectDetails } from '~src/redux/rooms/selectors';

const ProjectDetails = () => {
	const projectDetails = useRoomCreation_ProjectDetails();
	const dispatch = useDispatch();
	return (
		<article>
			<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
				A Project Name is Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..
			</p>
			<div className='flex items-center mt-[28px]'>
				<input
					value={projectDetails?.name}
					onChange={(e) => {
						dispatch(roomsActions.setRoomCreation_ProjectName(e.target.value));
					}}
					type='text'
					className='w-full flex-1 bg-transparent flex items-center justify-center border border-solid border-blue_primary outline-none rounded-2xl px-[18.5px] py-[21.5px] text-[#ABA3A3] placeholder:text-[#ABA3A3] font-normal text-lg leading-[22px]'
					placeholder='Project name'
				/>
			</div>
		</article>
	);
};

export default ProjectDetails;