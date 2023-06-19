// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import StartEndDate from './StartEndDate';
import { useRoomSelector } from '~src/redux/selectors';

const Dates = () => {
	const { loading,isPropsalPreviewState } = useRoomSelector();
	return (
		<div className='flex flex-col'>
			<StartEndDate
				isDisabled={loading||isPropsalPreviewState}
			/>
		</div>
	);
};

export default Dates;