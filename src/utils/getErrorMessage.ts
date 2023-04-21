// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const getErrorMessage = (error: any, otherMessage?: string): string => {
	const finalError = typeof error === 'string'? error: (typeof error === 'object' && error?.message)? error.message: otherMessage || 'Something went wrong.';
	return finalError;
};

export default getErrorMessage;