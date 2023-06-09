// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import SEOHead from '~src/global/SEOHead';

export const getServerSideProps: GetServerSideProps<{}> = async ({ query }) => {
	return {
		props: {},
		redirect: {
			destination: `/${query['house_id']}/proposals`
		}
	};
};

const SingleHouse = () => {
	const router = useRouter();
	const { query } = router;
	return (
		<>
			<SEOHead title={`House ${query['house_id']}.`} />
		</>
	);
};

export default SingleHouse;