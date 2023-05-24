// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Link from 'next/link';
import React, { FC } from 'react';

interface IEmptyHouse {}

const EmptyHouse: FC<IEmptyHouse> = () => {
	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<h3 className='text-white font-medium text-2xl'>
				No Rooms available
			</h3>
			<Link
				href='/room/create'
				className='px-4 py-2 outline-none bg-blue_primary border border-solid border-blue_primary rounded-md text-white cursor-pointer font-medium'
			>
				Create Room
			</Link>
		</div>
	);
};

export default EmptyHouse;