// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useRouter } from 'next/router';
import React from 'react';
import HouseSettings from '~src/components/House/Settings';
import HouseSidebar from '~src/components/House/Sidebar';
import SEOHead from '~src/global/SEOHead';
import BackButton from '~src/ui-components/BackButton';

const Settings = () => {
	const router = useRouter();
	const { query } = router;
	return (
		<>
			<SEOHead title={`Settings of House ${query['house_id']}.`} />
			<BackButton className='mb-3' />
			<section className='flex gap-x-[18px]'>
				<HouseSidebar />
				<div className='flex-1 flex flex-col gap-y-[21px]'>
					<HouseSettings />
				</div>
			</section>
		</>
	);
};

export default Settings;