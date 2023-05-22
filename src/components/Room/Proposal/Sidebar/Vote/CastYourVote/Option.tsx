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
	disabled: boolean;
}

const Option: FC<IOptionProps> = (props) => {
	const { option, disabled } = props;
	const { value } = option;
	const { voteCreation, proposal } = useProposalSelector();
	const dispatch = useDispatch();
	if (!proposal) return null;
	return (
		<button
			disabled={disabled}
			className={
				classNames('outline-none border-[0.5px] border-solid border-[#90A0B7] rounded-[7px] p-3', {
					'bg-[#04152F]': voteCreation.options.find((option) => option.value === value),
					'bg-transparent': !voteCreation.options.find((option) => option.value === value),
					'cursor-not-allowed': disabled,
					'cursor-pointer': !disabled
				})
			}
			onClick={() => {
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
			{value}
		</button>
	);
};

export default Option;