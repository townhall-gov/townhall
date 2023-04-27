// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Title from './Title';
import Description from './Description';
import Tags from './Tags';
import Dates from './Dates';
import HideResult from './HideResult';
import PreviewBtn from './PreviewBtn';

const CreateProposal = () => {
	return (
		<section className='flex flex-col gap-y-8'>
			<Title />
			<Description />
			<Tags />
			<Dates />
			<HideResult />
			<PreviewBtn />
		</section>
	);
};

export default CreateProposal;