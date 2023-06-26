// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IContractInfoInfoBody, IContractInfoInfoResponse } from 'pages/api/chain/data/getContractInfo';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { assetType, evmChains } from '~src/onchain-data/networkConstants';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { roomActions } from '~src/redux/room';
import { IStrategy } from '~src/redux/rooms/@types';
import api from '~src/services/api';
import Input from '~src/ui-components/Input';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IContractProps {
	isDisabled?: boolean;
	strategy: IStrategy;
}

const Contract: FC<IContractProps> = (props) => {
	const { isDisabled, strategy } = props;
	const dispatch = useDispatch();
	const [contractAddress, setContractAddress] = useState<string>('');

	useEffect(() => {
		(async() => {
			if (strategy.network && ((strategy.asset_type === assetType.Contract) && evmChains[strategy.network as keyof typeof evmChains]) && contractAddress) {
				try {
					const { data, error } = await api.post<IContractInfoInfoResponse, IContractInfoInfoBody>('chain/data/getContractInfo', {
						contract_address: contractAddress,
						network: strategy.network
					});
					if (data) {
						dispatch(roomActions.setRoomSettingsStrategiesEdit({
							...strategy,
							asset_type: assetType.Contract,
							token_metadata: {
								[assetType.Contract]: {
									contract_address: contractAddress,
									decimals: data.decimals,
									name: data.name,
									symbol: data.symbol
								}
							}
						}));
					} else {
						dispatch(notificationActions.send({
							message: getErrorMessage(error) || 'Contract address is not valid, unable to find the Contract Info.',
							status: ENotificationStatus.ERROR,
							title: 'Error!'
						}));
					}
				} catch (error) {
					dispatch(notificationActions.send({
						message: getErrorMessage(error) || 'Contract address is not valid, unable to find the Contract Info.',
						status: ENotificationStatus.ERROR,
						title: 'Error!'
					}));
				}
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [strategy.asset_type, strategy.network, contractAddress]);

	useEffect(() => {
		const token_metadata = strategy.token_metadata[strategy.asset_type];
		if (evmChains[strategy.network as keyof typeof evmChains] && token_metadata) {
			const contract_address = strategy.token_metadata[assetType.Contract]?.contract_address;
			if (contract_address !== contractAddress) {
				setContractAddress(contract_address || '');
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!((strategy.asset_type === assetType.Contract) && evmChains[strategy.network as keyof typeof evmChains])) {
		return null;
	}

	return (
		<article>
			<h5 className='mb-1'>Contract</h5>
			<Input
				placeholder='e.g. 0x000000000'
				isDisabled={isDisabled}
				value={contractAddress}
				type='text'
				onChange={(v) => {
					setContractAddress(v);
				}}
			/>
		</article>
	);
};

export default Contract;