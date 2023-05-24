// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { ThreeDotsIcon } from '~src/ui-components/CustomIcons';

const MenuBtn = () => {
	return (
		<button className='outline-none rounded-full border-2 border-solid border-blue_primary flex items-center justify-center w-10 h-10 bg-transparent cursor-pointer'>
			<ThreeDotsIcon className='text-xl text-transparent' />
		</button>
	);
};

export default MenuBtn;