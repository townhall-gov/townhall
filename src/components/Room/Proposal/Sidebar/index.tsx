// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';
import Timestamp from './Timestamp';
import Vote from './Vote';

interface ISidebarProps {
    className?: string;
}

const Sidebar: FC<ISidebarProps> = (props) => {
	const { className } = props;
	return (
		<div className={classNames('flex flex-col gap-y-6 sticky top-6 min-w-[350px]', className)}>
			<Vote />
			<Timestamp />
		</div>
	);
};

export default Sidebar;