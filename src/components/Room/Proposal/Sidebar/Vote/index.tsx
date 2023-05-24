// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import { Divider } from 'antd';
import AllVotes from './All';
import CastYourVote from './CastYourVote';
import api from '~src/services/api';
import { IVoteInfoQuery } from 'pages/api/vote';
import { EVotingSystem } from '~src/types/enums';
import { proposalActions } from '~src/redux/proposal';
import { useDispatch } from 'react-redux';
import { IVote } from '~src/types/schema';

const VoteInfo = () => {
	const { proposal, voteCreation } = useProposalSelector();
	const { user } = useProfileSelector();
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			if (!proposal || !user) return;
			const { house_id, id, room_id } = proposal;
			const res = await api.get<IVote, IVoteInfoQuery>('vote', {
				house_id,
				proposal_id: id,
				room_id,
				voter_address: user?.address
			});

			if (res.data) {
				const vote = res.data;
				if (vote && vote.voter_address === user?.address) {
					vote.options.forEach((currOption) => {
						const { value } = currOption;
						if (proposal.voting_system === EVotingSystem.SINGLE_CHOICE_VOTING) {
							if (voteCreation.options.find((option) => option.value === value)) {
								dispatch(proposalActions.setVoteCreation_Field({
									key: 'options',
									value: []
								}));
							} else {
								dispatch(proposalActions.setVoteCreation_Field({
									key: 'options',
									value: [currOption]
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
									value: [...voteCreation.options, currOption]
								}));
							}
						}

					});
				}
				dispatch(proposalActions.setVote(vote));
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	if (!proposal) return null;
	const { start_date, voting_system_options } = proposal;
	return (
		<section
			className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white'
		>
			<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[15px]'>
                Vote
			</h2>
			<div>
				<CastYourVote
					voting_system_options={voting_system_options}
					start_date={start_date}
					voteCreation={voteCreation}
				/>
				<Divider
					className='bg-blue_primary my-6'
				/>
				<AllVotes />
			</div>
		</section>
	);
};

export default VoteInfo;