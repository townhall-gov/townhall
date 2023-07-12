// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { useRoomSettings } from '~src/redux/room/selectors';
import { DeletionDarkIcon, EditDarkIcon, ExpandIcon, InfoDiamondIcon } from '~src/ui-components/CustomIcons';
import SelectedNetwork from './SelectedNetwork';
import SelectedSymbol from './SelectedSymbol';
import SelectedDecimal from './SelectedDecimal';
import SelectedAssetType from './SelectedAssetType';
import SelectedVotingThreshold from './SelectedVotingThreshold';
import SelectedVotingWeight from './SelectedVotingWeight';
import { getVotingStrategyTitle } from '~src/components/RoomCreate/Form/Stages/RoomStrategies';
import { Divider } from 'antd';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { useRoomSelector } from '~src/redux/selectors';
import AddStrategyOrThreshold from './AddStrategyOrThreshold';

interface IStrategiesProps {
    className?: string;
    isDisabled?: boolean;
}

const Strategies: FC<IStrategiesProps> = (props) => {
	const { isDisabled } = props;
	const dispatch = useDispatch();
	const roomSettings = useRoomSettings();
	const { room_strategies, room_strategies_threshold } = roomSettings;
	const { room } = useRoomSelector();
	console.log(room);
	return (
		<article>
			<div className='px-[18.5px] py-[21.5px] flex justify-center text-sm text-white items-center border border-solid border-[#66A5FF] rounded-2xl'>
				<InfoDiamondIcon className='text-[30px] mr-2 text-transparent stroke-white'/>
				<span className='text-[18px]'>You are in view mode only, to modify room settings connect with a controller or admin wallet</span>
			</div>
			<section className='border rounded-xl mt-[24px] border-solid border-[#66A5FF]'>
				{
					<article className='flex items-center justify-between'>
						<span className='p-5 text-xl leading-5 font-medium text-white'>
							Room strategies
						</span>
						<span className='px-[12px] flex justify-center items-center space-x-4'>
							<AddStrategyOrThreshold type={'Strategy'} isDisabled={isDisabled}/>
						</span>
					</article>
				}
				<Divider className='bg-blue_primary mt-0 mb-0' />
				{
					(room_strategies && Array.isArray(room_strategies) && room_strategies.length > 0)?
						<ul className='grid grid-cols-2 m-0'>
							{
								room_strategies.map((strategy, index) => {
									return (
										<li key={strategy.id} className={`  ${index%2==0  ? 'border-1 border-dashed border-t-0 border-l-0 border-[#66A5FF]':'border-1 border-dashed border-t-0 border-r-0 border-l-0 border-[#66A5FF]'} col-span-1 flex flex-col text-white m-0`}>
											<div className='flex items-center justify-between px-5 pt-6 pb-3'>
												<span className='text-base font-semibold '>
													Strategy  {index + 1}
												</span>
												{
													room_strategies.length > 1?
														<article className='flex justify-between space-x-2'>
															<div onClick={() => {
																dispatch(roomActions.setRoomSettingsStrategyObjectForEdit(strategy));
																dispatch(modalActions.setModal({
																	contentType: EContentType.ROOM_STRATEGY_EDIT_MODAL,
																	footerType: EFooterType.ROOM_STRATEGY_EDIT_MODAL,
																	open: true,
																	titleType: ETitleType.ROOM_STRATEGY_EDIT_MODAL
																}));
															}}>
																<EditDarkIcon className='text-lg cursor-pointer bg-app_background border-none'/>
															</div>
															<div
																onClick={() => {
																	dispatch(roomActions.setRoomSettingsStrategyIdDeleted(strategy.id));
																	dispatch(modalActions.setModal({
																		contentType: EContentType.ROOM_STRATEGY_DELETE_MODAL,
																		footerType: EFooterType.ROOM_STRATEGY_DELETE_MODAL,
																		open: true,
																		titleType: ETitleType.ROOM_STRATEGY_DELETE_MODAL
																	}));
																}}
															>
																<DeletionDarkIcon className='text-lg cursor-pointer bg-app_background border-none'
																/>
															</div>
														</article>
														: null
												}
											</div>
											<div>
												<div className='mx-5'>
													<Divider className='bg-blue_primary mt-0 mb-3'/>
												</div>
												<article  className="grid grid-cols-1 gap-y-[14px]  mx-5 text-white font-normal text-[14px] leading-none">
													<span className='text-[16px] font-medium leading-[20px] text-white mb-[3px]'>{getVotingStrategyTitle(strategy?.name)}</span>
													<SelectedNetwork
														strategy={strategy}
													/>
													<SelectedSymbol
														strategy={strategy}
													/>
													<SelectedDecimal
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
			<section className='border rounded-xl mt-[24px] border-solid border-[#66A5FF]'>
				{
					<article className='h-[60px] flex items-center justify-between'>
						<span className='mx-[20px] text-xl leading-5 font-medium text-white'>
							Proposal Creation Threshold
						</span>
						<span className='px-[12px] flex justify-center items-center space-x-4'>
							<AddStrategyOrThreshold type={'Threshold'} isDisabled={isDisabled}/>
						</span>
					</article>
				}
				<Divider className='bg-blue_primary mt-0 mb-0' />
				{
					(room_strategies_threshold && Array.isArray(room_strategies_threshold) && room_strategies_threshold.length > 0)?
						<ul className='grid grid-cols-2 m-0'>
							{
								room_strategies_threshold.map((room_strategy_threshold, index) => {
									return (
										<li key={room_strategy_threshold.id} className={` ${index%2==0?'border-1 border-dashed border-t-0 border-l-0 border-[#66A5FF]':'border-1 border-dashed border-t-0 border-r-0 border-l-0 border-[#66A5FF]'} col-span-1 flex flex-col text-white m-0`}>
											<div className='flex items-center justify-between px-5 pt-6 pb-3'>
												<span className='text-base font-semibold '>
													Threshold  {index + 1}
												</span>
												{
													room_strategies_threshold.length > 1?
														<article className='flex justify-between space-x-2'>
															<div
																onClick={() => {
																	dispatch(roomActions.setRoomSettingsStrategyThresholdObjectForEdit(room_strategy_threshold));
																	dispatch(modalActions.setModal({
																		contentType: EContentType.ROOM_STRATEGY_THRESHOLD_EDIT_MODAL,
																		footerType: EFooterType.ROOM_STRATEGY_THRESHOLD_EDIT_MODAL,
																		open: true,
																		titleType: ETitleType.ROOM_STRATEGY_THRESHOLD_EDIT_MODAL
																	}));
																}}
															>
																<EditDarkIcon className='text-lg cursor-pointer bg-app_background border-none'/>
															</div>
															<div
																onClick={() => {
																	dispatch(roomActions.setRoomSettingsStrategyThresholdIdDeleted(room_strategy_threshold.id));
																	dispatch(modalActions.setModal({
																		contentType: EContentType.ROOM_STRATEGY_THRESHOLD_DELETE_MODAL,
																		footerType: EFooterType.ROOM_STRATEGY_THRESHOLD_DELETE_MODAL,
																		open: true,
																		titleType: ETitleType.ROOM_STRATEGY_THRESHOLD_DELETE_MODAL
																	}));
																}}
															>
																<DeletionDarkIcon className='text-lg cursor-pointer bg-app_background border-none'
																/>
															</div>
														</article>

														: null
												}
											</div>
											<div>
												<div className='mx-5'>
													<Divider className='bg-blue_primary mt-0 mb-3'/>
												</div>
												<article  className="grid grid-cols-1 gap-y-[14px]  mx-5 text-white font-normal text-[14px] leading-none">
													<span className='text-[16px] font-medium leading-[20px] text-white mb-[3px]'>{getVotingStrategyTitle(room_strategy_threshold?.name)}</span>
													<SelectedNetwork
														strategy={room_strategy_threshold}
													/>
													<SelectedSymbol
														strategy={room_strategy_threshold}
													/>
													<SelectedDecimal
														strategy={room_strategy_threshold}
													/>
													<SelectedAssetType
														strategy={room_strategy_threshold}
													/>
													<SelectedVotingThreshold
														strategy={room_strategy_threshold}
													/>
													<SelectedVotingWeight
														strategy={room_strategy_threshold}
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
			<section className='border rounded-xl mt-[24px] border-solid border-[#66A5FF]'>
				{
					<article className='h-[60px] flex items-center justify-between'>
						<span className='mx-[20px] text-xl leading-5 font-medium text-white'>
							Admins
						</span>
						<span className='mx-[48px]'>
							<ExpandIcon className='text-2xl cursor-pointer bg-app_background border-none'/>
						</span>
					</article>
				}
			</section>
		</article>
	);
};

export default Strategies;