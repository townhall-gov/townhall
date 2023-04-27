// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GetServerSideProps } from 'next';
import React from 'react';

export const getServerSideProps: GetServerSideProps<any> = async () => {
	return {
		props: {}
	};
};

const Room = () => {
	return (
		<div>Room hi</div>
	);
};

export default Room;