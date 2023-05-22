// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Divider } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { proposalActions } from '~src/redux/proposal';

const CastYourVoteModalFooter = () => {
	const dispatch = useDispatch();
	return (
		<>
			<Divider className='bg-blue_primary' />
			<footer
				className='flex items-center justify-end flex-1 w-full gap-3'
			>
				<button
					className='bg-transparent text-white border border-solid border-blue_primary rounded-lg py-1 px-5 font-medium text-sm cursor-pointer'
					onClick={() => {
						dispatch(modalActions.setModal({
							contentType: EContentType.NONE,
							footerType: EFooterType.NONE,
							open: false,
							titleType: ETitleType.NONE
						}));
						dispatch(proposalActions.setLoading(false));
					}}
				>
                    Cancel
				</button>
				<button
					className='text-white border border-solid border-blue_primary rounded-lg py-1 px-5 font-medium text-sm cursor-pointer bg-blue_primary'
				>
                    Confirm
				</button>
			</footer>
		</>
	);
};

export default CastYourVoteModalFooter;