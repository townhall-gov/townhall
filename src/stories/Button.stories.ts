// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
	argTypes: {
		backgroundColor: {
			control: 'color'
		}
	},
	component: Button,
	tags: ['autodocs'],
	title: 'Example/Button'
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
	args: {
		label: 'Button',
		primary: true
	}
};

export const Secondary: Story = {
	args: {
		label: 'Button'
	}
};

export const Large: Story = {
	args: {
		label: 'Button',
		size: 'large'
	}
};

export const Small: Story = {
	args: {
		label: 'Button',
		size: 'small'
	}
};
