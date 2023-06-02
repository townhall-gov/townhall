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
interface IRoomAndHouseDropdownProps {
    className?: string;
}

const items: MenuProps['items'] = [
	{
		key: '1',
		label: 'Houses'
	},
	{
		key: '2',
		label: 'Rooms'
	},
	{
		key: '3',
		label: 'All'
	}
];

const RoomandHouseDropdown: React.FC<IRoomAndHouseDropdownProps> = () => {
	const dispatch = useDispatch();
	return (
		<Dropdown
			trigger={['click']}
			className={classNames('cursor-pointer px-[18.5px] py-[21.5px] ml-2 text-white border border-solid border-blue_primary rounded-2xl')}
			overlayClassName='ant-dropdown-menu-border-blue_primary'
			menu={{
				items: items,
				onClick: (e) => {
					const category = items.find((item: any) => item.key === e.key) as any;
					if (category.label === 'Houses') {
						dispatch(homeActions.setCategory('Houses'));
					}
					else if (category.label === 'Rooms') {
						dispatch(homeActions.setCategory('Rooms'));
					}
					else if (category.label === 'All') {
						dispatch(homeActions.setCategory('All'));
					}
				}

			}}
		>
			<Typography.Link>
				<Space>
					{useCategory()}
					<DownOutlined />
				</Space>
			</Typography.Link>
		</Dropdown>
	);
};

export default RoomandHouseDropdown;