// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
	component: Header,
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen'
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	title: 'Example/Header'
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedIn: Story = {
	args: {
		user: {
			name: 'Jane Doe'
		}
	}
};

export const LoggedOut: Story = {};
