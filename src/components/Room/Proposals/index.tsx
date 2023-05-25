// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useRoomSelector } from '~src/redux/selectors';
import ProposalCard from './ProposalCard';

const Proposals = () => {
	const { proposals } = useRoomSelector();
	return (
		<section className='flex flex-col gap-y-8 h-full'>
			<div className='flex flex-col gap-y-7 h-full max-h-[calc(100vh-182.5px-194px)] overflow-auto pr-2'>
				{
					proposals && Array.isArray(proposals) && proposals.length?
						proposals.map((proposal) => {
							return <ProposalCard key={proposal.id} proposal={proposal} />;
						})
						: <div
							className='flex flex-col justify-center items-center gap-4 flex-1'
						>
							<p
								className='text-green_primary text-xl font-bold'
							>
								No proposals yet.
							</p>
						</div>
				}

			</div>
		</section>
	);
};

export default Proposals;