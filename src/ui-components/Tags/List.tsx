// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { CloseOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import classNames from 'classnames';
import React, { FC } from 'react';

interface IListProps {
    tags: string[];
    deleteTag: (tag: string) => void;
    canDelete?: boolean;
	isDisabled?: boolean;
}

const List: FC<IListProps> = (props) => {
	const { tags, deleteTag, canDelete, isDisabled } = props;
	return (
		<>
			{
				tags.map((tag) => {
					return (
						<Tag
							closable={canDelete && !isDisabled}
							key={tag}
							aria-disabled={isDisabled}
							onClose={() => {
								if (!isDisabled) {
									deleteTag(tag);
								}
							}}
							closeIcon={<CloseOutlined className={classNames('text-blue_primary', {
								'cursor-not-allowed': isDisabled,
								'cursor-pointer': !isDisabled
							})} />}
							className={classNames('text-blue_primary border border-solid border-blue_primary font-normal text-xs leading-[20px] py-[1px] px-4 m-0 lowercase rounded-[11px]', `tags-${tag}`)}
							title={tag}
						>
							{tag.length > 25? tag.slice(0, 22) + '...': tag}
						</Tag>
					);
				})
			}
		</>
	);
};

export default List;