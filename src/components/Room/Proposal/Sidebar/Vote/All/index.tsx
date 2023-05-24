// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';

const AllVotes = () => {
	const dispatch = useDispatch();
	return (
		<article>
			<button
				className='border-none outline-none text-blue_primary font-medium text-sm leading-[22px] bg-transparent cursor-pointer'
				onClick={() => {
					dispatch(modalActions.setModal({
						contentType: EContentType.ALL_VOTES,
						footerType: EFooterType.NONE,
						open: true,
						titleType: ETitleType.ALL_VOTES
					}));
				}}
			>
                All Votes
			</button>
		</article>
	);
};

export default AllVotes;