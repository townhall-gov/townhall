// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Link from 'next/link';
import React,{ useEffect,useRef, useState } from 'react';
// import { HomeIcon, HolidayVillageIcon, ZoomInAreaIcon } from '~src/ui-components/CustomIcons';
import JoinedRoom from './JoinedRooms';
import { HomeIcon, HolidayVillageIcon } from '~src/ui-components/CustomIcons';

const Sidebar = () => {
	const [totalShowing, setTotalShowing] = useState(2);
	const componentRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const updatePercentage = () => {
			if (componentRef.current) {
				const { height } = componentRef.current.getBoundingClientRect();
				const windowHeight = window.innerHeight;
				const calculatedPercentage = (height / windowHeight) * 100;
				let newValue:number = 0;
				if (calculatedPercentage > 60 && calculatedPercentage<65) {
					newValue = 1;
				}
				else if (calculatedPercentage > 65 && calculatedPercentage<68) {
					newValue = 2;
				}
				else if (calculatedPercentage > 68 && calculatedPercentage<71) {
					newValue = 3;
				}
				else if (calculatedPercentage > 71 && calculatedPercentage<80)
				{
					newValue = 4;
				}
				else
				{
					newValue = 5;
				}
				console.log(newValue);
				setTotalShowing(newValue);
			}
		};
		window.addEventListener('resize', updatePercentage);
		updatePercentage();
		//console.log(percentage);
		return () => {
			window.removeEventListener('resize', updatePercentage);
		};

	});
	return (
		<aside ref={componentRef} className='min-h-full min-w-[93px] flex flex-col justify-between w-[93px] rounded-xl bg-blue_primary shadow-[-3px_4px_7px_#0E2D59] max-h-[calc(100vh-242px)] sticky top-[108px]'>
			<article className='flex flex-col'>
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
				<Link href='/houses' className='border-none outline-none bg-transparent flex flex-col gap-y-1 items-center justify-center cursor-pointer py-4 px-5 hover:bg-white'>
					<HolidayVillageIcon className='text-app_background stroke-transparent text-2xl' />
					<span className='text-app_background font-semibold text-xs leading-none flex flex-col items-center justify-center'>
						Houses
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