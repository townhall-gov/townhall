// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { LoadMoreIcon } from './CustomIcons';
const LoadMore: FC = () => {
	return (
		<div id='addressDropdown' className="flex items-center justify-center cursor-pointer w-[164px] px-[12px] py-[16px] border-2 border-solid border-blue_primary rounded-2xl">
			<div className='flex items-center justify-start text-white'>
				<span className='mr-3' >
					<LoadMoreIcon className='text-transparent stroke-app_background text-2xl border border-black'/>
				</span>
				<div className="font-helvetica-neue text-xl font-normal leading-6 tracking-tighter text-left m-auto">
                        Load more
				</div>
			</div>
		</div>
	);
};

export default LoadMore;