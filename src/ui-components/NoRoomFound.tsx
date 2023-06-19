// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { NoProposalsIcon } from './CustomIcons';

const NoRoomFound = () => {
	return (
		<article
			className='flex flex-col items-center justify-center gap-y-7 rounded-2xl bg-dark_blue_primary min-h-[458px]'
		>
			<NoProposalsIcon className='text-[251px]' />
			<h3 className='m-0 text-white font-medium text-2xl leading-[29px] tracking-[0.01em]'>
                No Room found
			</h3>
		</article>
	);
};

export default NoRoomFound;