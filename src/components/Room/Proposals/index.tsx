// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import ProposalCard from './ProposalCard';
import { IListingProposal } from '~src/redux/room/@types';
import Filter from './Filter';
import NoProposalsYet from '~src/ui-components/NoProposalsYet';

interface IProposalsProps {
	proposals: IListingProposal[] | null;
}

const Proposals: FC<IProposalsProps> = (props) => {
	const { proposals } = props;
	return (
		<section className='flex flex-col h-full'>
			<div
				className='flex items-center justify-end mb-[8.5px]'
			>
				<Filter />
			</div>
			{
				proposals && Array.isArray(proposals) && proposals.length ?
					<>
						<div className='flex flex-col gap-y-7 h-full pr-2'>
							{
								proposals.map((proposal) => {
									return <ProposalCard key={proposal.id} proposal={proposal} />;
								})
							}
						</div>
					</>
					: <NoProposalsYet />
			}

		</section>
	);
};

export default Proposals;