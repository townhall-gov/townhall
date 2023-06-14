// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { homeActions } from '~src/redux/home';
import { useCategory } from '~src/redux/home/selector';
import { GeometricIcon } from '../CustomIcons';
import SearchCategoryField from './SearchCategoryField';
import { firstCharUppercase } from '~src/utils/getFirstCharUppercase';

interface ISearchCategoryDropdownProps {
	className?: string;
}

const SearchCategoryDropdown: React.FC<ISearchCategoryDropdownProps> = () => {
	const category = useCategory();
	const items = [
		{
			key: 'houses',
			label: <SearchCategoryField title='Houses' />
		},
		{
			key: 'rooms',
			label: <SearchCategoryField title='Rooms' />
		},
		{
			key: 'all',
			label: <SearchCategoryField title='All' />
		}
	];
	const dispatch = useDispatch();
	return (
		<Dropdown
			trigger={['click']}
			className={classNames('flex justify-center items-center cursor-pointer text-white border-2 border-solid border-blue_primary rounded-2xl h-full max-h-[62px] px-[18px]')}
			overlayClassName='ant-dropdown-menu-border-blue_primary'
			menu={{
				items: items,
				onClick: (e) => {
					dispatch(homeActions.setCategory(e.key as any));
				}
			}}
		>
			<div
				className='flex items-center justify-between min-w-[175px] gap-x-[10px]'
			>
				<GeometricIcon className='text-transparent stroke-app_background text-2xl flex' />
				<span
					className='font-normal text-xl leading-[24px] text-white'
				>
					{firstCharUppercase(category)}
				</span>
				<DownOutlined />
			</div>
		</Dropdown>
	);
};

export default SearchCategoryDropdown;