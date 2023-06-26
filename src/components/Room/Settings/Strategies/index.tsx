// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { EVotingStrategy } from '~src/types/enums';
import { useRoomSettings } from '~src/redux/room/selectors';
import StrategyDropdown from './StrategyDropdown';
import NetworkDropdown from './NetworkDropdown';
import TokenInfo from './TokenInfo';
import Assets from './Assets';
import { assetType, chainProperties } from '~src/onchain-data/networkConstants';
import { v4 } from 'uuid';
import Threshold from './Threshold';
import VotingWeight from './VotingWeight';

interface IStrategiesProps {
    className?: string;
    isDisabled?: boolean;
}

const Strategies: FC<IStrategiesProps> = (props) => {
	const { isDisabled } = props;
	const dispatch = useDispatch();
	const roomSettings = useRoomSettings();
	const { room_strategies } = roomSettings;

	return (
		<article>
			<section className='flex flex-col gap-y-5'>
				{
					(room_strategies && Array.isArray(room_strategies) && room_strategies.length > 0)?
						<ul className='flex flex-col gap-y-5 m-0 mb-5'>
							{
								room_strategies.map((strategy, index) => {
									return (
										<li key={strategy.id} className='flex flex-col gap-y-4 text-white m-0'>
											<div className='flex items-center justify-between'>
												<span className='text-xl font-semibold'>
													Strategy #{index + 1}
												</span>
												{
													room_strategies.length > 1?
														<button
															onClick={() => {
																dispatch(roomActions.setRoomSettingsStrategiesDelete(strategy));
															}}
															className='bg-transparent flex items-center border-none outline-none text-red_primary text-sm font-medium cursor-pointer'
														>
															Delete
														</button>
														: null
												}
											</div>
											<StrategyDropdown
												isDisabled={isDisabled}
												strategy={strategy}
											/>
											<NetworkDropdown
												isDisabled={isDisabled}
												strategy={strategy}
											/>
											<Assets
												isDisabled={isDisabled}
												strategy={strategy}
											/>
											<TokenInfo
												strategy={strategy}
											/>
											<div className='grid grid-cols-2 gap-x-3'>
												<Threshold
													strategy={strategy}
													isDisabled={isDisabled}
													className='col-span-1'
												/>
												<VotingWeight
													strategy={strategy}
													isDisabled={isDisabled}
													className='col-span-1'
												/>
											</div>
										</li>
									);
								})
							}
						</ul>
						: null
				}
			</section>
			<button
				disabled={isDisabled}
				onClick={() => {
					const defaultNetwork = 'polkadot';
					dispatch(roomActions.setRoomSettingsStrategiesAdd({
						asset_type: assetType.Native,
						id: v4(),
						name: EVotingStrategy.BALANCE_OF,
						network: defaultNetwork,
						threshold: '',
						token_metadata: {
							[assetType.Native]: {
								decimals: chainProperties[defaultNetwork].decimals,
								name: '',
								symbol: chainProperties[defaultNetwork].symbol
							}
						},
						weight: ''
					}));
				}}
				className={
					classNames('border-none outline-none px-8 py-2 text-base bg-blue_primary flex items-center gap-x-2 text-white rounded-xl cursor-pointer')
				}
			>
				<PlusOutlined />
				<span>New Strategy</span>
			</button>
		</article>
	);
};

export default Strategies;