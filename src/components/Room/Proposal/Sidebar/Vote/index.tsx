// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useProposalSelector } from '~src/redux/selectors';
import { Divider } from 'antd';
import AllVotes from './All';
import CastYourVote from './CastYourVote';

const VoteInfo = () => {
	const { proposal, voteCreation } = useProposalSelector();
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