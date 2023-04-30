// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { DownOutlined } from '@ant-design/icons';
import React from 'react';

const RepliesWrapper = () => {
	return (
		<div className='mt-[14.5px]'>
			<div>
				<button className='border-none outline-none bg-transparent cursor-pointer text-xs font-normal leading-[22px] text-blue_primary flex items-center gap-x-1'>
					<span >Hide Replies</span>
					<DownOutlined className='flex items-center text-sm' />
				</button>
			</div>
			<section></section>
		</div>
	);
};

export default RepliesWrapper;