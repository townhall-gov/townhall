// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { IVotingSystemOption } from '~src/redux/room/@types';
import { useProposalSelector } from '~src/redux/selectors';
import { EVotingSystem } from '~src/types/enums';

interface IOptionProps {
	option: IVotingSystemOption;
	index: number;
}

const Option: FC<IOptionProps> = (props) => {
	const { option, index } = props;
	const { value } = option;
	const { voteCreation, proposal, loading } = useProposalSelector();
	const dispatch = useDispatch();

	if (!proposal) return null;
	return (
		<button
			disabled={loading}
			className={
				classNames('outline-none border-[0.5px] border-solid rounded-[7px] p-3 flex items-center gap-x-2', {
					'bg-blue_primary border-blue_primary': voteCreation.options.find((option) => option.value === value),
					'bg-transparent border-[#90A0B7]': !voteCreation.options.find((option) => option.value === value),
					'cursor-not-allowed': loading,
					'cursor-pointer': !loading
				})
			}
			onClick={() => {
				if (loading) return;
				if (proposal.voting_system === EVotingSystem.SINGLE_CHOICE_VOTING) {
					if (voteCreation.options.find((option) => option.value === value)) {
						dispatch(proposalActions.setVoteCreation_Field({
							key: 'options',
							value: []
						}));
					} else {
						dispatch(proposalActions.setVoteCreation_Field({
							key: 'options',
							value: [option]
						}));
					}
					return;
				} else {
					if (voteCreation.options.find((option) => option.value === value)) {
						dispatch(proposalActions.setVoteCreation_Field({
							key: 'options',
							value: voteCreation.options.filter((option) => option.value !== value)
						}));
					} else {
						dispatch(proposalActions.setVoteCreation_Field({
							key: 'options',
							value: [...voteCreation.options, option]
						}));
					}
				}
			}}
		>
			<span className='text-[#E1E6EB] text-xs font-medium leading-[12px]'>#{index}</span>
			<span className='text-white font-medium text-sm leading-[17px] tracking-[0.02em]'>
				{value}
			</span>
		</button>
	);
};

export default Option;