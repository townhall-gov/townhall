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
		<div className={classNames('flex items-center justify-between gap-3 bg-transparent border border-solid border-blue_primary rounded-2xl min-h-[65px] p-4', className)}>
			<article className='flex items-center flex-wrap gap-3'>
				<List
					isDisabled={isDisabled}
					tags={tags}
					canDelete={canDelete}
					deleteTag={deleteTag}
				/>
				{
					canAdd?
						<Add
							isDisabled={isDisabled}
							addTag={addTag}
						/>
						: null
				}
			</article>
			<p className='text-[#ABA3A3] m-0 font-normal text-[18px] leading-[22px]'>
				{tags?.length || 0}/5
			</p>
		</div>
	);
};

export default styled(Tags)``;