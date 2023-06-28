// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React, { FC } from 'react';
import { getNetworkTitle } from '~src/components/RoomCreate/Form/Stages/RoomStrategies';
import { assetType, chainProperties } from '~src/onchain-data/networkConstants';
import { roomActions } from '~src/redux/room';
import { IStrategy } from '~src/redux/rooms/@types';
import { useDispatch } from 'react-redux';
import BlockchainIcon from '~src/ui-components/BlockchainIcon';
import { EBlockchain } from '~src/types/enums';

interface INetworkDropdownProps {
    isDisabled?: boolean;
    strategy: IStrategy;
    className?: string;
}

const NetworkDropdown: FC<INetworkDropdownProps> = (props) => {
	const { strategy, isDisabled, className } = props;
	const dispatch = useDispatch();
	return (
		<article>
			<p className='mb-1'>Select network</p>
			<Dropdown
				disabled={isDisabled}
				trigger={['click']}
				className={classNames('px-[18.5px] py-[21.5px] border border-solid border-blue_primary rounded-2xl voting_system_type', className, {
					'cursor-not-allowed': isDisabled,
					'cursor-pointer': !(isDisabled)
				})}
				overlayClassName='ant-dropdown-menu-border-blue_primary'
				menu={{
					items: Object.values(chainProperties).map((network) => {
						return {
							key: network.name,
							label: (
								<div
									className={classNames('flex items-center text-base leading-none py-2 text-white cursor-pointer')}
								>
									<BlockchainIcon className={classNames('text-2xl mr-2', className)} type={ network.name as EBlockchain }/>
									{getNetworkTitle(network.name)}
								</div>
							)
						};
					}),
					onClick: (e) => {
						const network = e.key as keyof typeof chainProperties;
						const chain = chainProperties[network];
						dispatch(roomActions.setRoomSettingsStrategiesEdit({
							...strategy,
							asset_type: assetType.Native,
							network: network,
							token_metadata: {
								[assetType.Native]: {
									decimals: chain.decimals,
									name: '',
									symbol: chain.symbol
								}
							}
						}));
					}
				}}
			>
				{
					strategy?.network?
						<div id='votingTypeDropdown' className="flex justify-between items-center text-white font-medium text-base leading-none">
							<span className='flex items-center'>
								<BlockchainIcon className={classNames('text-2xl mr-2', className)} type={ strategy?.network as EBlockchain }/>
								{getNetworkTitle(strategy?.network)}
							</span>
							<DownOutlined/>
						</div>
						: <p className='m-0 flex justify-between items-center text-grey_light text-base leading-none'>
							<span>Select network for voting strategy</span>
							<DownOutlined/>
						</p>
				}
			</Dropdown>
		</article>
	);
};

export default NetworkDropdown;