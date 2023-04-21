// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import messages from './messages';

async function nextApiClientFetch<T>(url: string, data?: {[key: string]: any}) : Promise<{ data?: T, error?: string }> {
	const response = await fetch(`${window.location.origin}/${url}`, {
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST'
	});

	const resJSON = await response.json();

	if(response.status === 200) return {
		data: resJSON as T
	};

	return {
		error: resJSON.error || messages.API_FETCH_ERROR
	};
}

export default nextApiClientFetch;
