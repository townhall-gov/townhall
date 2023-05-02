// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { useHousesSelector } from '~src/redux/selectors';
import HouseField from './HouseField';
import { IHouse } from '~src/types/schema';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import api from '~src/services/api';
import { housesActions } from '~src/redux/houses';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IHouseDropdownProps {
    className?: string;
}

const HouseDropdown: FC<IHouseDropdownProps> = (props) => {
	const { className } = props;
	const [houseItems, setHouseItems] = useState<ItemType[]>([]);
	const { houses } = useHousesSelector();
	const [selectedHouse, setSelectedHouse] = useState<IHouse>();
	const dispatch = useDispatch();

	useEffect(() => {
		if (houses && Array.isArray(houses) && houses.length === 0) {
			(async () => {
				try {
					const { data, error } = await api.get<IHouse[], {}>('houses', {});
					if (error) {
						dispatch(housesActions.setError(getErrorMessage(error)));
					} else if (!data) {
						dispatch(housesActions.setError('Something went wrong.'));
					} else {
						dispatch(housesActions.setHouses(data));
					}
				} catch (error) {
					dispatch(housesActions.setError(getErrorMessage(error)));
				}
			})();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [houses]);

	useEffect(() => {
		setHouseItems(houses.map((house) => {
			return {
				key: house.id,
				label: (
					<HouseField house={house} />
				)
			};
		}));
	}, [houses]);

	return (
		<Dropdown
			trigger={['click']}
			className={classNames('cursor-pointer px-[18.5px] py-[21.5px] border border-solid border-blue_primary rounded-2xl', className)}
			overlayClassName='ant-dropdown-menu-border-blue_primary'
			menu={{
				items: houseItems,
				onClick: (e) => {
					const house = houses.find((house) => house.id === e.key);
					dispatch(roomsActions.setRoomCreation_House(house));
					setSelectedHouse(house);
				}
			}}
		>
			<div id='addressDropdown' className="flex justify-between items-center">
				{
					selectedHouse?
						<HouseField house={selectedHouse} />
						: <span className='text-[#ABA3A3] font-normal text-lg leading-[22px]'>
                                Select House
						</span>
				}
				<span className='flex items-center justify-center text-white'>
					<DownOutlined />
				</span>
			</div>
		</Dropdown>
	);
};

export default HouseDropdown;