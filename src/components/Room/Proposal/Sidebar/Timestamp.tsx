// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useProposalSelector } from '~src/redux/selectors';
import { IStrategyWithHeight } from '~src/types/schema';

const Timestamp = () => {
	const { proposal } = useProposalSelector();
	const [uniqueNetworkandSnapshot,setuniqueNetworkandSnapshot]=useState<(IStrategyWithHeight | undefined)[]>([]);
	useEffect(() => {
		let uniqueArray = Array.from(
			new Set(voting_strategies_with_height.map(obj => `${obj.network}-${obj.height}`))
		).map(key => {
			const [network, height] = key.split('-');
			return voting_strategies_with_height.find(voting_strategy => voting_strategy.network === network && voting_strategy.height.toString() === height);
		});
		if(uniqueArray) {
			uniqueArray=uniqueArray.slice(1);
			setuniqueNetworkandSnapshot(uniqueArray);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[]);
	if (!proposal) return null;
	const { voting_strategies_with_height, created_at, start_date, end_date } = proposal;
	return (
		<section
			className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white'
		>
			<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[15px]'>
                Time Stamp
			</h2>
			<div className='flex flex-col gap-y-[10px] leading-[22px] font-normal tracking-[0.02em]'>
				{
					voting_strategies_with_height?.length?
						<p className='grid grid-cols-3 gap-x-1 m-0 items-center'>
							<span className='col-span-2 text-sm text-grey_primary'>
                                Block number
							</span>
							<span className='col-span-1 flex justify-end items-center gap-1 text-end text-xs'>
								<span>#{voting_strategies_with_height?.[0]?.height}</span>
								{
									voting_strategies_with_height?.length>1 &&
										<Tooltip
											color='#66A5FF'
											title={
												<div>
													<ul
														className='grid grid-cols-2 list-decimal p-2 space-x-2'
													>
														<ul className='grid-col-1'>
															<span className='grid-col-1'>Network</span>
															{
																uniqueNetworkandSnapshot?.map((voting_strategy) => {
																	return (
																		<ul
																			key={voting_strategy?.network}
																		>
																			{voting_strategy?.network}
																		</ul>
																	);
																})
															}
														</ul>
														<ul className='grid-col-1'>
															<span className='grid-col-1'>Snapshot</span>
															{
																uniqueNetworkandSnapshot?.map((voting_strategy) => {
																	return (
																		<ul
																			key={voting_strategy?.height}
																		>
																			#{voting_strategy?.height}
																		</ul>
																	);
																})
															}
														</ul>
													</ul>
												</div>

											}
										>
											<span
												className='text-xs text-black rounded-2xl bg-[#66A5FF] px-[8px] py-[2px] cursor-pointer'
											>
                                            +{uniqueNetworkandSnapshot?.length }
											</span>
										</Tooltip>
								}
							</span>
						</p>
						: null
				}
				{
					created_at?
						<p className='grid grid-cols-2 gap-x-1 m-0 items-center'>
							<span className='col-span-1 text-sm text-grey_primary'>
                                Created
							</span>
							<span className='col-span-1 text-end text-xs'>
								{dayjs(created_at).format('MMM D, YYYY HH:mm')}
							</span>
						</p>
						: null
				}
				{
					start_date?
						<p className='grid grid-cols-2 gap-x-1 m-0 items-center'>
							<span className='col-span-1 text-sm text-grey_primary'>
                                Voting Start Date
							</span>
							<span className='col-span-1 text-end text-xs'>
								{dayjs(start_date).format('MMM D, YYYY HH:mm')}
							</span>
						</p>
						: null
				}
				{
					end_date?
						<p className='grid grid-cols-2 gap-x-1 m-0 items-center'>
							<span className='col-span-1 text-sm text-grey_primary'>
                                Voting End Date
							</span>
							<span className='col-span-1 text-end text-xs'>
								{dayjs(end_date).format('MMM D, YYYY HH:mm')}
							</span>
						</p>
						: null
				}
			</div>
		</section>
	);
};

export default Timestamp;