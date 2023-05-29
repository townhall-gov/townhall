// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const firstCharUppercase = (str: string) => {
	if (str && str.length > 0) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	return str;
};

export {
	firstCharUppercase
};