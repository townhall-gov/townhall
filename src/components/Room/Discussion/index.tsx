// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Sidebar from './Sidebar';
import ContentWrapper from './ContentWrapper';

const Discussion = () => {
	return (
		<section className='grid grid-cols-10 gap-6 relative w-full'>
			<ContentWrapper className='col-span-7' />
			<Sidebar className='col-span-3' />
		</section>
	);
};

export default Discussion;