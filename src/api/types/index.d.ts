// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextApiRequest, NextApiResponse } from 'next';

interface TNextApiRequest<B> extends NextApiRequest {
	body: B;
}

type TNextApiHandler<T, B> = (req: TNextApiRequest<B>, res: NextApiResponse<T | { error?: string }>) => Promise<any>;

type TParams = {
	[key: string]: any;
};

type TApiResponse<T> = {
	data?: T;
	error?: string;
	status?: number;
};

export {
	TNextApiHandler,
	TParams,
	TApiResponse
};