// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import classNames from 'classnames';
import React, { FC } from 'react';
import styled from 'styled-components';
import List from './List';
import Add from './Add';

interface ITagsProps {
    className?: string;
    canAdd?: boolean;
    canDelete?: boolean;
    tags: string[];
    addTag: (tag: string) => void;
    deleteTag: (tag: string) => void;
	isDisabled?: boolean;
}

const Tags: FC<ITagsProps> = (props) => {
	const { className, addTag, tags, deleteTag, canDelete, canAdd, isDisabled } = props;
	return (
		<div className={classNames('flex items-center flex-wrap gap-3', className)}>
			{
				canAdd?
					<Add
						isDisabled={isDisabled}
						addTag={addTag}
					/>
					: null
			}
			<List
				isDisabled={isDisabled}
				tags={tags}
				canDelete={canDelete}
				deleteTag={deleteTag}
			/>
		</div>
	);
};

export default styled(Tags)``;