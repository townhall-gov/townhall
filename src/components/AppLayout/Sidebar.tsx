// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Link from 'next/link';
import React,{ useEffect,useRef, useState } from 'react';
// import { HomeIcon, HolidayVillageIcon, ZoomInAreaIcon } from '~src/ui-components/CustomIcons';
import JoinedRoom from './JoinedRooms';
import { HomeIcon, HousesIcon, RoomsIcon } from '~src/ui-components/CustomIcons';

const Sidebar = () => {
	const [totalShowing, setTotalShowing] = useState(2);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const linksContainerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const updateTotalRoomsVisible = () => {
			if (sidebarRef.current && linksContainerRef.current) {
				const { height } = sidebarRef.current.getBoundingClientRect();
				const { height: linksContainerHeight } = linksContainerRef.current.getBoundingClientRect();
				const gapBetweenLinksAndRooms = 50;
				const singleRoomHeight = 61;
				const heightRemaining = height - linksContainerHeight - gapBetweenLinksAndRooms;
				setTotalShowing(Math.floor(heightRemaining / singleRoomHeight));
			}
		};
		window.addEventListener('resize', updateTotalRoomsVisible);
		updateTotalRoomsVisible();
		return () => {
			window.removeEventListener('resize', updateTotalRoomsVisible);
		};
	});
	return (
		<aside ref={sidebarRef} className='min-h-full min-w-[93px] flex flex-col justify-between w-[93px] rounded-xl bg-blue_primary shadow-[-3px_4px_7px_#0E2D59] max-h-[calc(100vh-242px)] sticky top-[108px]'>
			<article ref={linksContainerRef} className='flex flex-col'>
				<Link href='/' className='border-none outline-none bg-transparent flex flex-col gap-y-1 items-center justify-center cursor-pointer py-4 px-5 hover:bg-white rounded-t-xl'>
					<HomeIcon className='text-transparent stroke-app_background text-2xl' />
					<span className='text-app_background font-semibold text-xs leading-none'>Home</span>
				</Link>
				{/* <Link href='/room/create' className='border-none outline-none bg-transparent flex flex-col gap-y-1 items-center justify-center cursor-pointer py-4 px-5 hover:bg-white'>
					<ZoomInAreaIcon className='text-transparent stroke-app_background text-2xl' />
					<span className='text-app_background font-semibold text-xs leading-none flex flex-col items-center justify-center'>
						<span>Create</span>
						<span>Room</span>
					</span>
				</Link> */}
				<Link href='/houses' className='border-none text-light_grey_primary outline-none bg-transparent flex flex-col gap-y-1 items-center justify-center cursor-pointer py-4 px-5 hover:bg-white'>
					<HousesIcon className='text-transparent stroke-transparent text-3xl' />
					<span className=' font-semibold text-xs leading-none flex flex-col items-center justify-center'>
						Houses
					</span>
				</Link>
				<Link href='/rooms' className='border-none text-light_grey_primary outline-none bg-transparent flex flex-col gap-y-1 items-center justify-center cursor-pointer py-4 px-5 hover:bg-white'>
					<RoomsIcon className='stroke-transparent text-3xl' />
					<span className='font-semibold text-xs leading-none flex flex-col items-center justify-center'>
						All
					</span>
					<span className='font-semibold text-xs leading-none flex flex-col items-center justify-center'>
						Rooms
					</span>
				</Link>
			</article>
			<article>
				<JoinedRoom totalShowing={totalShowing}/>
			</article>
		</aside>
	);
};

export default Sidebar;