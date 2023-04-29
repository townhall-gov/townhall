// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';

interface ISidebarProps {
    className?: string;
}

const Sidebar: FC<ISidebarProps> = (props) => {
	const { className } = props;
	return (
		<div className={classNames(className)}>Sidebar</div>
	);
};

export default Sidebar;