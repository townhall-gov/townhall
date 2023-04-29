// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Heading from './Heading';
import { useProposalSelector } from '~src/redux/selectors';
import Description from './Description';
import Reactions from './Reactions';

const Content = () => {
	const { proposal } = useProposalSelector();
	if (!proposal) return null;
	const { proposer_address, title, tags, description, id } = proposal;
	return (
		<section
			className='border border-solid border-blue_primary rounded-2xl'
		>
			<Heading
				address={proposer_address}
				tags={tags}
				title={title}
				id={id}
			/>
			<div className='py-[18px] px-[25px] flex flex-col gap-y-[14.5px]'>
				<Reactions />
				<Description
					value={description}
				/>
			</div>
		</section>
	);
};

export default Content;