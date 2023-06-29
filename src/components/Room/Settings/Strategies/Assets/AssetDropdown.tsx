// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Select } from 'antd';
import classNames from 'classnames';
import { ITokensMetadataBody } from 'pages/api/chain/data/getTokensMetadata';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { assetChains, assetType } from '~src/onchain-data/networkConstants';
import { TTokenMetadata } from '~src/onchain-data/token-meta/getTokensMetadata';
import { roomActions } from '~src/redux/room';
import { IStrategy } from '~src/redux/rooms/@types';
import { useRoomSelector } from '~src/redux/selectors';
import api from '~src/services/api';

interface IAssetDropdownProps {
	isDisabled?: boolean;
	strategy: IStrategy;
}

const AssetDropdown: FC<IAssetDropdownProps> = (props) => {
	const { isDisabled, strategy } = props;
	const dispatch = useDispatch();
	const { tokensMetadata } = useRoomSelector();

	useEffect(() => {
		(async() => {
			if (strategy.network && ((strategy.asset_type === assetType.Assets) && assetChains[strategy.network as keyof typeof assetChains]) && (tokensMetadata[strategy.network as keyof typeof assetChains] || []).length === 0) {
				try {
					const res = await api.post<TTokenMetadata[], ITokensMetadataBody>('chain/data/getTokensMetadata', {
						network: strategy.network
					});
					if (res.data && Array.isArray(res.data) && res.data.length > 0) {
						dispatch(roomActions.setTokensMetadata({
							key: strategy.network as keyof typeof assetChains,
							value: res.data
						}));
					}
				} catch (error) {
					// console.log(error);
				}
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [strategy.asset_type, strategy.network]);

	if (!((strategy.asset_type === assetType.Assets) && assetChains[strategy.network as keyof typeof assetChains])) {
		return null;
	}

	return (
		<article>
			<h5 className='mb-1'>Asset </h5>
			<Select
				showSearch
				value={strategy.token_metadata[strategy.asset_type]?.name}
				disabled={isDisabled}
				className={classNames('border-none w-full', {
					'cursor-not-allowed': isDisabled,
					'cursor-pointer': !isDisabled
				})}
				virtual={false}
				onChange={(value) => {
					const tokenMetadata = (tokensMetadata[strategy.network as keyof typeof assetChains] || [])?.find((tokenMetadata) => JSON.stringify(tokenMetadata.tokenId) === value);
					dispatch(roomActions.setRoomSettingsStrategiesEdit({
						...strategy,
						asset_type: assetType.Assets,
						token_metadata: {
							[assetType.Assets]: tokenMetadata
						}
					}));
				}}
				optionFilterProp="label"
				optionLabelProp='label'
				filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes((input ?? '').toLowerCase())}
				options={(tokensMetadata[strategy.network as keyof typeof assetChains] || [])?.map((tokenMetadata) => {
					return {
						label: tokenMetadata.name,
						value: JSON.stringify(tokenMetadata.tokenId || '')
					};
				})}
				placeholder="Select Asset"
			/>
		</article>
	);
};

export default AssetDropdown;