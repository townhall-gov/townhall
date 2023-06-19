// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const pattern = /^https:\/\/(?:www\.)?townhallgov\.com\/(\w+)\/(\w+)\/(discussion|proposal)\/(\d+)$/;

const postLinkCreationValidation = {
	url: (url?: string | null) => {
		let error = '';
		if (!url || typeof url !== 'string') {
			error = 'URL is required.';
		} else {
			const isValidURL = pattern.test(url);
			if (!isValidURL) {
				error = 'URL is not valid';
			}
		}
		return error;
	}
};

export {
	postLinkCreationValidation
};