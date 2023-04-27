// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { CloseOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React, { FC } from 'react';

interface IListProps {
    tags: string[];
    deleteTag: (tag: string) => void;
    canDelete?: boolean;
}

const List: FC<IListProps> = (props) => {
	const { tags, deleteTag, canDelete } = props;
	return (
		<>
			{
				tags.map((tag) => {
					return (
						<Tag
							closable={canDelete}
							key={tag}
							onClose={() => deleteTag(tag)}
							closeIcon={<CloseOutlined className='text-white' />}
							className='text-white border border-solid border-blue_primary py-[1px] m-0'
						>
							{tag}
						</Tag>
					);
				})
			}
		</>
	);
};

export default List;