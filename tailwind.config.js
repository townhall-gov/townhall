// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}'
	],
	corePlugins: {
		preflight: false
	},
	important: true,
	plugins: [],
	theme: {
		extend: {
			colors: {
				app_background: 'var(--app_background)',
				blue_primary: 'var(--blue_primary)',
				grey_primary: 'var(--grey_primary)',
				grey_secondary: 'var(--grey_secondary)'
			},
			fontFamily: {
				poppins: ['var(--font-montserrat)']
			}
		}
	}
};
