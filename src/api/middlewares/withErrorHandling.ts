// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextApiHandler } from 'next';

type TWithErrorHandling = (handler: NextApiHandler) => NextApiHandler;

const withErrorHandling: TWithErrorHandling = (handler) => {
	return async (req, res) => {
		// CORS preflight request
		if(req.method === 'OPTIONS') return res.status(200).end();

		try {
			await handler(req, res);
		} catch (error) {
			// console log needed for logging on server
			console.log('Error in API : ', error);
			res.status(Number(error.name) || 500).json({
				...error,
				message: error.message || 'Something went wrong while fetching data. Please try again later.'
			});
		}
	};
};

export default withErrorHandling;