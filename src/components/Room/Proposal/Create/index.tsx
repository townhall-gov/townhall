// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Title from './Title';
import Description from './Description';
import Tags from './Tags';
import Dates from './Dates';

const CreateProposal = () => {
	return (
		<section className='flex flex-col gap-y-8'>
			<Title />
			<Description />
			<Tags />
			<Dates />
		</section>
	);
};

export default CreateProposal;