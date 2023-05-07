// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useProposalCreation } from '~src/redux/room/selectors';
import { EVotingSystem } from '~src/types/enums';
import SingleChoiceVoting from './SingleChoiceVoting';

const VotingSystemChoices = () => {
	const { voting_system } = useProposalCreation();
	return (
		<div>
			<h4 className='text-grey_light'>Choices</h4>
			<section>
				{(() => {
					switch(voting_system) {
					case EVotingSystem.SINGLE_CHOICE_VOTING:
						return <SingleChoiceVoting />;
					default:
						return <></>;
					}
				})()}
			</section>
		</div>
	);
};

export default VotingSystemChoices;