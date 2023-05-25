// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useRouter } from 'next/router';
import React from 'react';
import Room from '~src/components/Room';
import SEOHead from '~src/global/SEOHead';

const ProposalCreate = () => {
	const router = useRouter();
	const { query } = router;
	return (
		<>
			<SEOHead title={`Create a Proposal in Room ${query['room_id']} of House ${query['house_id']}`} />
			<div>
				<Room />
			</div>
		</>
	);
};

export default ProposalCreate;