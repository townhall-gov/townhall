// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Typography } from 'antd';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { homeActions } from '~src/redux/home';
import { useCategory } from '~src/redux/home/selector';
interface ISearchCategoryDropdownProps {
	className?: string;
}

const items: MenuProps['items'] = [
	{
		key: 'houses',
		label: 'Houses'
	},
	{
		key: 'rooms',
		label: 'Rooms'
	},
	{
		key: 'all',
		label: 'All'
	}
];

const SearchCategoryDropdown: React.FC<ISearchCategoryDropdownProps> = () => {
	const dispatch = useDispatch();
	return (
		<Dropdown
			trigger={['click']}
			className={classNames('cursor-pointer px-[18.5px] py-[21.5px] ml-2 text-white border border-solid border-blue_primary rounded-2xl')}
			overlayClassName='ant-dropdown-menu-border-blue_primary'
			menu={{
				items: items,
				onClick: (e) => {
					dispatch(homeActions.setCategory(e.key));
				}

			}}
		>
			<Typography.Link>
				<Space>
					{useCategory().toUpperCase()}
					<DownOutlined />
				</Space>
			</Typography.Link>
		</Dropdown>
	);
};

export default SearchCategoryDropdown;