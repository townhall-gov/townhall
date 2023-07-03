// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useProposalSelector } from '~src/redux/selectors';

const Timestamp = () => {
	const { proposal } = useProposalSelector();
	if (!proposal) return null;
	const { voting_strategies_with_height, created_at, start_date, end_date } = proposal;
	console.log('voting_strategies_with_height',voting_strategies_with_height);
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
													<h4>Block numbers</h4>
													<ul
														className='m-0 pl-4 list-decimal'
													>
														{
															voting_strategies_with_height?.map((voting_strategy) => {
																return (
																	<li
																		key={voting_strategy.height}
																	>
																		{voting_strategy.height}
																	</li>
																);
															})
														}
													</ul>
												</div>

											}
										>
											<span
												className='text-xs text-black rounded-2xl bg-[#66A5FF] px-[8px] py-[2px] cursor-pointer'
											>
                                            +{voting_strategies_with_height.length - 1}
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