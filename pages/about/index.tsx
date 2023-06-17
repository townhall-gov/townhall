// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import SEOHead from '~src/global/SEOHead';
import ComingSoon from '~src/ui-components/ComingSoon';

const About = () => {
	return (
		<>
			<SEOHead title='About Us' />
			<div className='h-full'>
				<ComingSoon />
			</div>
		</>
	);
};

export default About;