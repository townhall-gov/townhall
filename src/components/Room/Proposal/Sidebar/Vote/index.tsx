// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import VoteResults from './Results';
import { useProposalSelector } from '~src/redux/selectors';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import AllVotes from './All';

const VoteInfo = () => {
	const { proposal } = useProposalSelector();
	if (!proposal) return null;
	const { is_vote_results_hide_before_voting_ends, start_date, end_date } = proposal;
	return (
		<section
			className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white'
		>
			<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[15px]'>
                Vote
			</h2>
			<div>
				<Divider className='bg-blue_primary my-6' />
				{

					is_vote_results_hide_before_voting_ends?
						(
							dayjs().isAfter(dayjs(end_date))? <VoteResults /> : (
								<p className='m-0 font-normal text-sm leading-[17px] text-center'>
									Results are hidden till voting ends.
								</p>
							)
						):
						(
							dayjs().isAfter(dayjs(start_date)) ? <VoteResults />: (
								<p className='m-0 font-normal text-sm leading-[17px] text-center'>
									Voting hasn{"'"}t started yet.
								</p>
							)
						)
				}
				<Divider className='bg-blue_primary my-6' />
				<AllVotes />
			</div>
		</section>
	);
};

export default VoteInfo;