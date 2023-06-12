// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import ContentWrapper from './ContentWrapper';
import Sidebar from './Sidebar';
import { useProposalSelector } from '~src/redux/selectors';

const ProposalWrapper = () => {
	const { proposal } = useProposalSelector();
	if (!proposal) return null;
	return (
		<section className='flex gap-6 relative w-full'>
			<ContentWrapper className='flex-1' />
			<Sidebar className='' />
		</section>
	);
};

export default ProposalWrapper;