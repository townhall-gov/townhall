// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Checkbox } from 'antd';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';

interface IHideResultProps {
	isDisabled?: boolean;
}

const HideResult: FC<IHideResultProps> = (props) => {
	const { isDisabled } = props;
	const dispatch = useDispatch();
	return (
		<div className='flex items-center gap-x-2'>
			<Checkbox
				disabled={isDisabled}
				onChange={(e) => {
					dispatch(roomActions.setProposalCreation_Field({
						key: 'is_vote_results_hide_before_voting_ends',
						value: e.target.checked
					}));
				}}
				id='hide_result'
				className='text-white bg-transparent'
			/>
			<label htmlFor="hide_result" className='text-white mt-1 cursor-pointer'>
                Hide vote results before voting ends.
			</label>
		</div>
	);
};

export default HideResult;