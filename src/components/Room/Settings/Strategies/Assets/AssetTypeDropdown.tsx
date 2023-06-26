// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import classNames from 'classnames';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { assetChains, assetType, chainProperties } from '~src/onchain-data/networkConstants';
import { roomActions } from '~src/redux/room';
import { IStrategy } from '~src/redux/rooms/@types';

interface IAssetTypeDropdownProps {
	isDisabled?: boolean;
    strategy: IStrategy;
}

const AssetTypeDropdown: FC<IAssetTypeDropdownProps> = (props) => {
	const { isDisabled, strategy } = props;
	const dispatch = useDispatch();
	return (
		<article>
			<h5 className='mb-1'>Asset Type</h5>
			<Dropdown
				disabled={isDisabled}
				trigger={['click']}
				className={classNames('px-[18.5px] py-[21.5px] border border-solid border-blue_primary rounded-2xl voting_system_type', {
					'cursor-not-allowed': isDisabled,
					'cursor-pointer': !isDisabled
				})}
				overlayClassName='ant-dropdown-menu-border-blue_primary'
				menu={{
					items: chainProperties[strategy.network as keyof typeof assetChains]?.assets?.map((assetType) => {
						return {
							key: assetType,
							label: (
								<p
									className={classNames('text-base leading-none py-2 text-white cursor-pointer')}
								>
									{assetType}
								</p>
							)
						};
					}),
					onClick: (e) => {
						const asset_type = e.key as keyof typeof assetType;
						const chain = chainProperties[strategy.network as keyof typeof chainProperties];
						if (asset_type === assetType.Assets) {
							dispatch(roomActions.setRoomSettingsStrategiesEdit({
								...strategy,
								asset_type,
								token_metadata: {
									[assetType.Assets]: {
										decimals: chain.decimals,
										name: '',
										symbol: chain.symbol,
										tokenId: null
									}
								}
							}));
						} else if (asset_type === assetType.Contract) {
							dispatch(roomActions.setRoomSettingsStrategiesEdit({
								...strategy,
								asset_type,
								token_metadata: {
									[assetType.Contract]: {
										contract_address: '',
										decimals: chain.decimals,
										name: '',
										symbol: chain.symbol
									}
								}
							}));
						} else {
							dispatch(roomActions.setRoomSettingsStrategiesEdit({
								...strategy,
								asset_type,
								token_metadata: {
									[assetType.Native]: {
										decimals: chain.decimals,
										name: '',
										symbol: chain.symbol
									}
								}
							}));
						}
					}
				}}
			>
				{
					strategy.asset_type?
						<p id='votingTypeDropdown' className="flex justify-between items-center text-white font-medium text-base leading-none">
							{strategy.asset_type}
							<DownOutlined/>
						</p>
						:
						<p className='m-0 flex justify-between text-grey_light text-base leading-none'>
							<span>Select Asset Type</span>
							<DownOutlined/>
						</p>
				}
			</Dropdown>
		</article>
	);
};

export default AssetTypeDropdown;