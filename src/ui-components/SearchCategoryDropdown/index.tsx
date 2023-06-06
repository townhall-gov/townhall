// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Typography } from 'antd';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { homeActions } from '~src/redux/home';
import { useCategory } from '~src/redux/home/selector';
import { GeometricIcon } from '../CustomIcons';
import SearchCategoryField from './SearchCategoryField';
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
	const [houseItems, setHouseItems] = useState<any[]>([
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
	]);
	useEffect(() => {
		setHouseItems(items.map((item) => {
			return {
				key: item?.key,
				label: (
					<SearchCategoryField category={item} />
				)
			};
		}));
	}, []);
	const dispatch = useDispatch();
	return (
		<Dropdown
			trigger={['click']}
			className={classNames(' flex justify-center items-center cursor-pointer px-[18.5px] h-[62px] ml-2 text-white border border-solid border-blue_primary rounded-2xl')}
			overlayClassName='ant-dropdown-menu-border-blue_primary'
			menu={{
				items: houseItems,
				onClick: (e) => {
					dispatch(homeActions.setCategory(e.key));
				}

			}}
		>
			<Typography.Link>
				<Space>
					<GeometricIcon className='text-transparent stroke-app_background text-2xl flex' />
					{useCategory().toUpperCase()}
					<DownOutlined />
				</Space>
			</Typography.Link>
		</Dropdown>
	);
};

export default SearchCategoryDropdown;