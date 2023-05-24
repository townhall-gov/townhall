// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { IVotingSystemOption } from '~src/redux/room/@types';
import { useProposalSelector } from '~src/redux/selectors';
import { EVotingSystem } from '~src/types/enums';
import { getOptionPercentage } from '~src/utils/calculation/getStrategyWeight';

interface IOptionProps {
	option: IVotingSystemOption;
	isLoggedIn: boolean;
	isRoomJoined: boolean;
	connectWallet: () => void;
	joinRoom: () => void;
}

const Option: FC<IOptionProps> = (props) => {
	const { option, connectWallet, isLoggedIn, isRoomJoined, joinRoom } = props;
	const { value } = option;
	const { voteCreation, proposal } = useProposalSelector();
	const dispatch = useDispatch();
	const [total, setTotal] = useState(0);

	useEffect(() => {
		if (proposal?.votes_result) {
			const total = getOptionPercentage(proposal?.votes_result, value);
			setTotal(Number(total));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [proposal?.votes_result]);

	if (!proposal) return null;
	return (
		<button
			className={
				classNames('outline-none border-[0.5px] border-solid border-[#90A0B7] rounded-[7px] p-3 cursor-pointer', {
					'bg-[#04152F]': voteCreation.options.find((option) => option.value === value),
					'bg-transparent': !voteCreation.options.find((option) => option.value === value)
				})
			}
			onClick={() => {
				if (!isLoggedIn) {
					connectWallet();
					return;
				}
				if (!isRoomJoined) {
					joinRoom();
					return;
				}
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
			<p className='flex items-center justify-center gap-x-2'>
				<span
					className='flex items-center justify-center'
				>
					{value}
				</span>
				<span
					className='flex items-center justify-center text-grey_primary text-xs'
				>
					{(total || 0).toFixed(1)}%
				</span>
			</p>
		</button>
	);
};

export default Option;