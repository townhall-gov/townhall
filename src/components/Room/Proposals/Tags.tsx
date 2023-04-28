// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';

interface ITagsProps {
    tags: string[];
}

const Tags: FC<ITagsProps> = (props) => {
	const { tags } = props;
	if (!tags || !Array.isArray(tags) || !tags.length) return null;
	return (
		<p className='flex items-center gap-x-2 m-0 p-0'>
			{
				tags.map((tag) => {
					return (
						<span key={tag} className='text-[#3D74C5] font-normal text-xs leading-[20px] border border-solid border-[#3D74C5] rounded-[11.5px] px-4 flex items-center justify-center m-0'>
							{tag}
						</span>
					);
				})
			}
		</p>
	);
};

export default Tags;