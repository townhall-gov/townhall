// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import StartEndDate from './StartEndDate';
import PreparationPeriod from './PreparationPeriod';

const Dates = () => {
	return (
		<div className='flex flex-col'>
			<h3 className='text-white font-medium text-xl'>Dates</h3>
			<div className='mt-2 flex gap-5'>
				<StartEndDate />
				<PreparationPeriod />
			</div>
		</div>
	);
};

export default Dates;