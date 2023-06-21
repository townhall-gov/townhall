// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Link from 'next/link';
import React from 'react';
import { HomeIcon, HolidayVillageIcon, ZoomInAreaIcon } from '~src/ui-components/CustomIcons';
import JoinedRoom from './JoinedRooms';

const Sidebar = () => {
	return (
		<aside className='min-h-full min-w-[93px] flex flex-col justify-between w-[93px] rounded-xl bg-blue_primary shadow-[-3px_4px_7px_#0E2D59] max-h-100vh sticky top-[108px]'>
			<article className='flex flex-col'>
				<Link href='/' className='border-none outline-none bg-transparent flex flex-col gap-y-1 items-center justify-center cursor-pointer py-4 px-5 hover:bg-white rounded-t-xl'>
					<HomeIcon className='text-transparent stroke-app_background text-2xl' />
					<span className='text-app_background font-semibold text-xs leading-none'>Home</span>
				</Link>
				<Link href='/room/create' className='border-none outline-none bg-transparent flex flex-col gap-y-1 items-center justify-center cursor-pointer py-4 px-5 hover:bg-white'>
					<ZoomInAreaIcon className='text-transparent stroke-app_background text-2xl' />
					<span className='text-app_background font-semibold text-xs leading-none flex flex-col items-center justify-center'>
						<span>Create</span>
						<span>Room</span>
					</span>
				</Link>
				<Link href='/houses' className='border-none outline-none bg-transparent flex flex-col gap-y-1 items-center justify-center cursor-pointer py-4 px-5 hover:bg-white'>
					<HolidayVillageIcon className='text-app_background stroke-transparent text-2xl' />
					<span className='text-app_background font-semibold text-xs leading-none flex flex-col items-center justify-center'>
						Houses
					</span>
				</Link>
			</article>
			<article>
				<JoinedRoom/>
			</article>
		</aside>
	);
};

export default Sidebar;