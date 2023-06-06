// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useRouter } from 'next/router';
import React from 'react';
import House from '~src/components/House';
import SEOHead from '~src/global/SEOHead';

const Settings = () => {
	const router = useRouter();
	const { query } = router;
	return (
		<>
			<SEOHead title={`Settings of House ${query['house_id']}.`} />
			<div>
				<House />
			</div>
		</>
	);
};

export default Settings;