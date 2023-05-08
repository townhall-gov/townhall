// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';
import Timestamp from './Timestamp';
import VoteInfo from './Vote';

interface ISidebarProps {
    className?: string;
}

const Sidebar: FC<ISidebarProps> = (props) => {
	const { className } = props;
	return (
		<div className={classNames('flex flex-col gap-y-10', className)}>
			<Timestamp />
			<VoteInfo />
		</div>
	);
};

export default Sidebar;