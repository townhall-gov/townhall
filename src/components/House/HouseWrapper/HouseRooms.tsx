// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Image } from 'antd';
import Link from 'next/link';
import { IHouseRoom } from 'pages/api/house/rooms';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';

interface IHouseRoomsProps {
    houseRooms: IHouseRoom[] | null;
    house_id: string;
}

const HouseRooms: FC<IHouseRoomsProps> = (props) => {
	const { houseRooms, house_id } = props;
	const dispatch = useDispatch();
	const handleModalTrigger = () => {
		dispatch(modalActions.setModal({
			contentType: EContentType.HOUSE_ROOMS,
			footerType: EFooterType.NONE,
			open: true,
			titleType: ETitleType.HOUSE_ROOMS
		}));
	};
	return (
		<article className='text-blue_primary rounded-2xl border border-solid border-blue_primary p-[17.5px] w-[171px]'>
			{
				(houseRooms && Array.isArray(houseRooms) && houseRooms.length > 0)? (
					<>
						<h4 className='text-white font-medium text-sm leading-[17px] tracking-[0.01em]'>
							Rooms
						</h4>
						<div
							className='grid grid-cols-2 gap-[7.67px]'
						>
							{
								houseRooms.slice(0, 3)?.map((room, index) => {
									return (
										<Link href={`/${house_id}/${room.id}/proposals`} key={index} className='flex items-center justify-center bg-white w-16 h-16 rounded-2xl'>
											<Image preview={false} alt={room.title} src={room?.logo} width={45} height={45} className='rounded-full' />
										</Link>
									);
								})
							}
							{
								houseRooms.length === 4? (
									<>
										<Link href={`/${house_id}/${houseRooms[3].id}/proposals`} className='flex items-center justify-center bg-white w-16 h-16 rounded-2xl'>
											<Image preview={false} alt={houseRooms[3].title} src={houseRooms[3]?.logo} width={45} height={45} className='rounded-full' />
										</Link>
									</>
								) : houseRooms.length > 4? (
									<>
										<button
											onClick={handleModalTrigger}
											className='border-none outline-none cursor-pointer flex items-center justify-center w-16 h-16 bg-white rounded-2xl text-[#0E2D59] tracking-[0.01em] text-base leading-[20px] font-normal'
										>
											+{
												(houseRooms.length - 3)
											}
										</button>
									</>
								) : null
							}
						</div>
					</>
				): <p className='m-0 flex flex-col items-center justify-center h-full text-green_primary font-medium text-xl'>
					<span>
						No Room
					</span>
					<span>
						Found
					</span>
				</p>
			}
		</article>
	);
};

export default HouseRooms;