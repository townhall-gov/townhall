// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Room from '~src/components/Room';

export const getServerSideProps: GetServerSideProps<any> = async () => {
	return {
		props: {}
	};
};

const SingleRoom = () => {
	const router = useRouter();
	useEffect(() => {
		const { query } = router;
		router.push(`/house/${query['house_id']}/room/${query['room_id']}/proposals`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div>
			<Room />
		</div>
	);
};

export default SingleRoom;