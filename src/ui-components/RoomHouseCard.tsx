// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { Image, Spin } from 'antd';
import classNames from 'classnames';
import Link from 'next/link';
import React, { FC, ReactNode, useRef } from 'react';
import { CropFreeIcon } from './CustomIcons';
import DefaultNameImage from './DefaultNameImage';
import { useHousesSelector } from '~src/redux/selectors';

interface IRoomHouseCardProps {
    isJoined: boolean;
    isDisabled: boolean;
    logo: string;
    totalLabel: ReactNode;
    onClick: () => Promise<void>;
    link: string;
    onLinkClick?: () => void;
    name: string;
	house_id?: string;
}

const RoomHouseCard: FC<IRoomHouseCardProps> = (props) => {
	const { isDisabled, isJoined, logo, totalLabel, onClick, name, link, onLinkClick, house_id } = props;
	const joinBtnRef = useRef<HTMLButtonElement>(null!);
	const { houses } = useHousesSelector();
	const roomHouse = houses.find((house) => house.id === house_id);
	return (
		<>
			<article
				onMouseEnter={() => {
					if (joinBtnRef.current) {
						if (isJoined && joinBtnRef.current.textContent?.includes('Joined')) {
							joinBtnRef.current.textContent = 'Leave';
						}
					}
				}}
				onMouseLeave={() => {
					if (joinBtnRef.current) {
						if (isJoined && joinBtnRef.current.textContent?.includes('Leave')) {
							joinBtnRef.current.textContent = 'Joined';
						}
					}
				}}
				className={classNames('highlight flex flex-col items-center justify-center gap-y-2 cursor-pointer w-[188px]', {
					'card-disabled': isDisabled,
					'card-hover': !isJoined,
					'card-hover-joined': isJoined,
					'card-joined': isJoined
				})}
			>
				<Link
					href={link}
					onClick={onLinkClick}
					className='border border-solid border-blue_primary rounded-lg outline-none flex flex-col gap-y-2 items-center bg-transparent p-5 px-7 w-full cursor-pointer min-h-[186px]'
				>
					{
						logo?
							<div
								className='w-[45px] h-[45px] rounded-full relative'
							>
								<Image preview={false} width={45} height={45} className='rounded-full' src={logo} alt='room logo' />
								{
									roomHouse && roomHouse.logo?
										<div
											className='absolute w-[22px] h-[22px] rounded-full -bottom-1.5 -right-1.5'
										>
											<Image preview={false} width={22} height={22} className='rounded-full' src={roomHouse.logo} alt='house logo' />
										</div>
										: null
								}
							</div>
							: <DefaultNameImage className='w-[45px] h-[45px]' name={name} />
					}

					<h3 className='text-white m-0 p-0 text-2xl leading-[29px] tracking-[0.01em] font-semibold truncate'>{name}</h3>
					<p className='m-0 text-sm font-normal leading-[17px] text-grey_tertiary'>
						{totalLabel}
					</p>
					<CropFreeIcon className='text-grey_primary text-lg mt-[3px]' />
				</Link>
				<Spin
					className='text-white'
					wrapperClassName='w-full rounded-2xl overflow-hidden'
					spinning={isDisabled}
					indicator={<LoadingOutlined />}
				>
					<button
						ref={joinBtnRef}
						disabled={isDisabled}
						onClick={onClick}
						className='join border border-solid border-blue_primary rounded-2xl outline-none flex items-center justify-center py-1 px-2 w-full bg-transparent text-sm leading-[20px] font-semibold text-white cursor-pointer'
					>
						{ isJoined ? 'Joined' : 'Join' }
					</button>
				</Spin>
			</article>
		</>
	);
};

export default RoomHouseCard;