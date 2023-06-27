// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import AllVotes from './All';
import { useProposalSelector } from '~src/redux/selectors';
import VotingResult from './Result';
import BigNumber from 'bignumber.js';

const VoteInfo = () => {
	const { proposal } = useProposalSelector();
	const [voted, setVoted] = useState(new BigNumber(0));

	useEffect(() => {
		if (proposal?.votes_result) {
			let voted = new BigNumber(0);
			Object.entries(proposal?.votes_result).forEach(([, value]) => {
				value.forEach(({ value }) => {
					voted = voted.plus(value);
				});
			});
			setVoted(voted);
		}
	}, [proposal?.votes_result]);

	if (!proposal) return null;
	const { votes_result } = proposal;
	return (
		<section
			className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white'
		>
			<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[15px]'>
                Vote
			</h2>
			<>
				<VotingResult
					voted={voted}
					votes_result={votes_result}
				/>
				<Divider
					className='bg-blue_primary my-6'
				/>
				<div className='my-6 flex items-center justify-between gap-x-2 text-[#90A0B7] font-medium text-sm leading-[22px]'>
					<span>Voted</span>
					<span className='font-medium text-xs leading-[22px] text-white'>{voted.toFixed(1)} VOTE</span>
				</div>
				<AllVotes />
			</>
		</section>
	);
};

export default VoteInfo;