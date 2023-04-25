// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';

const getErrorMessage = (error: any, otherMessage?: string): string => {
	const finalError = typeof error === 'string'? error: (typeof error === 'object' && error?.message)? error.message: otherMessage || 'Something went wrong.';
	return finalError;
};

export const getErrorStatus = (error: any, otherStatusCode?: number): number => {
	if (error && error.name && !isNaN(Number(error.name))) {
		return Number(error.name);
	}
	return otherStatusCode || StatusCodes.INTERNAL_SERVER_ERROR;
};

export default getErrorMessage;