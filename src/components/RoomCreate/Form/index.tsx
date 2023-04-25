// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import RoomCreationStages from './Stages';
import HighlightLines from './HighlightLines';
import StageChangeBtn from './ChangeBtn';

const Form = () => {
	return (
		<div className='flex-1 flex flex-col'>
			<h2 className='m-0 p-0 text-[28px] leading-[34px] font-medium tracking-[0.01em] text-white mb-6'
			>
                Create a Room
			</h2>
			<RoomCreationStages />
			<HighlightLines />
			<StageChangeBtn />
		</div>
	);
};

export default Form;