// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';

interface IDiscussionSidebarProps {
    className?: string;
}

const DiscussionSidebar: FC<IDiscussionSidebarProps> = (props) => {
	const { className } = props;
	return (
		<div className={classNames('flex flex-col gap-y-6 sticky top-6', className)}>
            Yes
		</div>
	);
};

export default DiscussionSidebar;