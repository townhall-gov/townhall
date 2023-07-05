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
import { assetType, chainProperties } from '~src/onchain-data/networkConstants';
import { v4 } from 'uuid';
import { AddIcon, DeleteDarkIcon, InfoDiamondIcon } from '~src/ui-components/CustomIcons';
import SelectedNetwork from './SelectedNetwork';
import SelectedSymbol from './SelectedSymbol';
import SelectedDecimal from './SelectedDecimal';
import SelectedAsset from './SelectedAsset';
import SelectedAssetType from './SelectedAssetType';
import SelectedVotingThreshold from './SelectedVotingThreshold';
import SelectedVotingWeight from './SelectedVotingWeight';
import { getVotingStrategyTitle } from '~src/components/RoomCreate/Form/Stages/RoomStrategies';

interface IStrategiesProps {
    className?: string;
    isDisabled?: boolean;
}

const Strategies: FC<IStrategiesProps> = (props) => {
	const { isDisabled } = props;
	const dispatch = useDispatch();
	const roomSettings = useRoomSettings();
	const { room_strategies } = roomSettings;
	console.log(room_strategies);
	return (
		<article>
			<div className='px-[18.5px] py-[21.5px] flex justify-center text-sm text-white items-center border border-solid border-[#66A5FF] rounded-2xl'>
				<InfoDiamondIcon className='text-[30px] mr-2 text-transparent stroke-white'/>
				<span className='text-[18px]'>You are in view mode only, to modify room settings connect with a controller or admin wallet</span>
			</div>
			<section className='flex flex-col gap-y-5 mt-5'>
				{
					(room_strategies && Array.isArray(room_strategies) && room_strategies.length > 0)?
						<ul className='grid grid-cols-2 gap-10 m-0 mb-5'>
							{
								room_strategies.map((strategy, index) => {
									return (
										<li key={strategy.id} className='col-span-1 flex flex-col gap-y-4 text-white m-0'>
											<div className='flex items-center justify-between'>
												<span className='text-xl font-semibold'>
													Strategy  {index + 1}
												</span>
												{
													room_strategies.length > 1?
														<article className='flex justify-between'>
															<div>
																<AddIcon className='text-4xl cursor-pointer bg-app_background border-none'/>
															</div>
															<div
																onClick={() => {
																	dispatch(roomActions.setRoomSettingsStrategiesDelete(strategy));
																}}
															>
																<DeleteDarkIcon className='text-4xl cursor-pointer bg-app_background border-none'
																/>
															</div>
														</article>

														: null
												}
											</div>
											<div className='border rounded-xl border-solid border-[#66A5FF]'>
												<article  className="grid grid-cols-1 gap-y-[14px]  ml-[24px] mt-[23px] text-white font-normal text-[14px] leading-none">
													<h6 className='text-[20px] font-bold leading-[20px] text-white'>{getVotingStrategyTitle(strategy?.name)}</h6>
													<SelectedNetwork
														strategy={strategy}
													/>
													<SelectedSymbol
														strategy={strategy}
													/>
													<SelectedDecimal
														strategy={strategy}
													/>
													<SelectedAsset
														strategy={strategy}
													/>
													<SelectedAssetType
														strategy={strategy}
													/>
													<SelectedVotingThreshold
														strategy={strategy}
													/>
													<SelectedVotingWeight
														strategy={strategy}
													/>
												</article>
											</div>

										</li>
									);
								})
							}
						</ul>
						: null
				}
			</section>
			{
				(room_strategies && Array.isArray(room_strategies) && room_strategies.length > 8)?
					null
					: <button
						disabled={isDisabled}
						onClick={() => {
							const defaultNetwork = 'polkadot';
							dispatch(roomActions.setRoomSettingsStrategiesAdd({
								asset_type: assetType.Native,
								id: v4(),
								name: EVotingStrategy.BALANCE_OF,
								network: defaultNetwork,
								proposal_creation_threshold: '',
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
							classNames('border-none outline-none px-8 py-2 text-base bg-green_primary flex items-center gap-x-2 text-white rounded-xl cursor-pointer')
						}
					>
						<PlusOutlined />
						<span>New Strategy</span>
					</button>
			}
		</article>
	);
};

export default Strategies;