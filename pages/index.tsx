// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'dayjs-init';
import React from 'react';
import WorkingOnItBanner from '~src/ui-components/WorkingOnItBanner';

const Home = () => {
	return (
		<div
			className='h-full'
		>
			<WorkingOnItBanner />
		</div>
	);
};

export default Home;