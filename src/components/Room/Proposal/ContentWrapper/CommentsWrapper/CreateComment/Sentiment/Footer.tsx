// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';

const SentimentModalFooter = () => {
	const dispatch = useDispatch();
	return (
		<div className='flex items-center justify-center mt-6'>
			<button
				onClick={() => {
					dispatch(modalActions.setOpen(false));
				}}
				className='bg-green_primary py-[2px] px-2 rounded-[4px] font-medium text-xs leading-[18px] tracking-[0.01em] border-none outline-none cursor-pointer'
			>
				Done
			</button>
		</div>
	);
};

export default SentimentModalFooter;