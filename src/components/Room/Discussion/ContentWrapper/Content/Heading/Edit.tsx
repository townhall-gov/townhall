// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { PenToolAddIcon } from '~src/ui-components/CustomIcons';

const Edit = () => {
	return (
		<button
			className='outline-none border-none bg-transparent flex items-center justify-center gap-x-1 text-grey_tertiary font-medium text-base leading-[20px] tracking-[0.01em] cursor-pointer'
		>
			<PenToolAddIcon className='text-xl text-transparent stroke-grey_tertiary' />
			<span>Edit</span>
		</button>
	);
};

export default Edit;