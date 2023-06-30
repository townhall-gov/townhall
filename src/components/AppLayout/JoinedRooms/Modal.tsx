// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { useProfileJoinedRooms } from '~src/redux/profile/selectors';
import { Image } from 'antd';
import DefaultNameImage from '~src/ui-components/DefaultNameImage';
import router from 'next/router';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { useDispatch } from 'react-redux';

interface IJoinedRoomsModalTitleProps {}
export const JoinedRoomsModalTitle: FC<IJoinedRoomsModalTitleProps> = () => {
	return <>Joined Rooms</>;
};

const JoinedRoomsModalContent = () => {
	const joinedRooms = useProfileJoinedRooms();
	const dispatch = useDispatch();
	return (
		<div
			className='border-0 border-t border-solid border-blue_primary'
		>
			<section className='flex items-center justify-center gap-[18px] flex-wrap my-[54.5px] max-w-[310px] m-auto'>
				{
					(joinedRooms && Array.isArray(joinedRooms) && joinedRooms.length > 0)? joinedRooms?.map((joinedRoom, index) => {
						return (
							<button
								onClick={() => {
									dispatch(modalActions.setModal({
										contentType: EContentType.NONE,
										footerType: EFooterType.NONE,
										open: false,
										titleType: ETitleType.NONE
									}));
									router.push(`/${joinedRoom?.house_id}/${joinedRoom.id}/proposals`);
								}}
								title={joinedRoom.id}
								key={index}
								className='cursor-pointer border-none outline-none flex items-center justify-center text-[45px] w-16 h-16 bg-white rounded-2xl'
							>
								{
									joinedRoom.logo?
										<Image preview={false} width={45} height={45} className='rounded-full' src={joinedRoom.logo} alt={joinedRoom.title} />
										: <DefaultNameImage
											name={joinedRoom.id}
											className='w-[45px] h-[45px]'
										/>
								}
							</button>
						);
					}): <>
						<p
							className='m-0 p-0 text-xl font-medium text-green_primary'
						>
                            There is no room in this house.
						</p>
					</>
				}
			</section>
		</div>
	);
};

export default JoinedRoomsModalContent;