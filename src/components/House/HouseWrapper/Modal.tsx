// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { Image } from 'antd';
import DefaultNameImage from '~src/ui-components/DefaultNameImage';
import { useHouseSelector } from '~src/redux/selectors';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { useRouter } from 'next/router';

interface IHouseRoomsModalTitleProps {}
export const HouseRoomsModalTitle: FC<IHouseRoomsModalTitleProps> = () => {
	const { house } = useHouseSelector();
	return <>Rooms For House {house?.title}</>;
};

const HouseRoomsModalContent = () => {
	const { houseRooms, house } = useHouseSelector();
	const dispatch = useDispatch();
	const router = useRouter();
	if (!house) {
		return null;
	}
	return (
		<div
			className='border-0 border-t border-solid border-blue_primary'
		>
			<section className='flex items-center justify-center gap-[18px] flex-wrap my-[54.5px] max-w-[310px] m-auto'>
				{
					(houseRooms && Array.isArray(houseRooms) && houseRooms.length > 0)? houseRooms?.map((houseRoom, index) => {
						return (
							<button
								onClick={() => {
									dispatch(modalActions.setModal({
										contentType: EContentType.NONE,
										footerType: EFooterType.NONE,
										open: false,
										titleType: ETitleType.NONE
									}));
									router.push(`/${house?.id}/${houseRoom.id}/proposals`);
								}}
								title={houseRoom.id}
								key={index}
								className='cursor-pointer border-none outline-none flex items-center justify-center text-[45px] w-16 h-16 bg-white rounded-2xl'
							>
								{
									houseRoom.logo?
										<Image preview={false} width={45} height={45} className='rounded-full' src={houseRoom.logo} alt={houseRoom.title} />
										: <DefaultNameImage
											name={houseRoom.id}
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

export default HouseRoomsModalContent;