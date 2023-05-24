// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import Address from 'src/ui-components/Address';

interface IAddressDropdownProps {
    addresses: string[];
    className?: string;
    onAddressChange: (address: string) => void;
}

const AddressDropdown: FC<IAddressDropdownProps> = (props) => {
	const { className, onAddressChange, addresses } = props;
	const [selectedAddress, setSelectedAddress] = useState('');
	const [addressItems, setAddressItems] = useState<ItemType[]>([]);

	useEffect(() => {
		if (addresses.length > 0) {
			setSelectedAddress(addresses[0]);
		}
		setAddressItems(addresses.map((address) => {
			return {
				key: address,
				label: (
					<Address
						ethIdenticonSize={24}
						identiconSize={24}
						address={address}
					/>
				)
			};
		}));
	}, [addresses]);

	return (
		<Dropdown
			trigger={['click']}
			className={classNames('cursor-pointer p-2 border border-solid border-grey_secondary rounded-sm', className)}
			menu={{
				items: addressItems,
				onClick: (e) => {
					setSelectedAddress(e.key);
					onAddressChange(e.key);
				}
			}}
		>
			<div id='addressDropdown' className="flex justify-between items-center">
				<Address
					ethIdenticonSize={24}
					identiconSize={24}
					address={selectedAddress}
				/>
				<span>
					<DownOutlined />
				</span>
			</div>
		</Dropdown>
	);
};

export default AddressDropdown;
