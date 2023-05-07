// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import VotingTypeDropdown from './VotingTypeDropdown';
import VotingSystemChoices from './Choices';

const SelectVotingSystem = () => {
	return (
		<div className='flex flex-col'>
			<h3 className='text-white font-medium text-xl'>Voting System</h3>
			<article className='flex flex-col gap-y-3'>
				<VotingTypeDropdown />
				<VotingSystemChoices />
			</article>
		</div>
	);
};

export default SelectVotingSystem;