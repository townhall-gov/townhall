// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { HomeIcon } from '~src/ui-components/CustomIcons';

const Sidebar = () => {
	return (
		<aside className='min-h-full rounded-xl bg-blue_primary shadow-[-3px_4px_7px_#0E2D59]'>
			<article className='flex flex-col gap-y-6'>
				<button className='border-none outline-none bg-transparent flex flex-col gap-y-1 items-center justify-center cursor-pointer py-4 px-5 hover:bg-white rounded-t-xl'>
					<HomeIcon className='text-transparent stroke-app_background text-2xl' />
					<span className='text-app_background font-semibold text-xs leading-none'>Home</span>
				</button>
			</article>
		</aside>
	);
};

export default Sidebar;