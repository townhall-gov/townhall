// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';
import Content from './Content';
import CommentsWrapper from './CommentsWrapper';

interface IDiscussionContentWrapperProps {
    className?: string;
}

const DiscussionContentWrapper: FC<IDiscussionContentWrapperProps> = (props) => {
	const { className } = props;
	return (
		<div className={classNames('flex flex-col gap-y-12', className)}>
			<Content />
			<CommentsWrapper />
		</div>
	);
};

export default DiscussionContentWrapper;