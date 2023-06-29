// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Tooltip } from 'antd';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useProposalSelector } from '~src/redux/selectors';
import { IVote } from '~src/types/schema';
import Address from '~src/ui-components/Address';
import { calculateStrategy } from '~src/utils/calculation/getStrategyWeight';
import { firstCharUppercase } from '~src/utils/getFirstCharUppercase';

interface IVoteProps {
    vote: IVote;
}

const Vote: FC<IVoteProps> = (props) => {
	const { vote } = props;
	const { proposal } = useProposalSelector();
	if (!vote || !proposal) return null;
	return (
		<article
			className='grid grid-cols-3 gap-x-2'
		>
			<Address
				identiconSize={20}
				ethIdenticonSize={20}
				addressClassName='text-sm'
				addressMaxLength={10}
				address={vote.voter_address}
			/>
			<div className='flex items-center justify-center'>
				<Tooltip
					color='#04152F'
					overlayClassName='min-w-max'
					title={
						<article>
							<h4
								className='grid grid-cols-7 gap-2 text-base font-medium'
							>
								<span className='flex justify-center'>Strategy</span>
								<span className='flex justify-center'>Chain</span>
								<span className='flex justify-center'>Snapshot</span>
								<span className='flex justify-center items-center gap-x-1'>
									<span>Threshold</span>
									<span className='flex items-center justify-center bg-grey_primary rounded-full text-[10px] text-white font-medium w-4 h-4'>
										<Tooltip
											color='#04152F'
											title={'Account with Balance >= Threshold can vote'}
										>
										?
										</Tooltip>
									</span>
								</span>
								<span className='flex justify-center'>Balance</span>
								<span className='flex justify-center items-center gap-x-1'>
									<span>Weight</span>
									<span className='flex items-center justify-center bg-grey_primary rounded-full text-[10px] text-white font-medium w-4 h-4'>
										<Tooltip
											color='#04152F'
											title={'Voting weight refers to the level of influence Total = Balance * Weight'}
										>
										?
										</Tooltip>
									</span>
								</span>
								<span className='flex justify-center'>Total</span>
							</h4>
							<ul
								className='m-0 pl-4 list-decimal'
							>
								{
									proposal.voting_strategies_with_height.map((strategy) => {
										const { name, network, id, asset_type, height, threshold, weight } = strategy;
										const balance = vote.balances.find((item) => item.id === id);
										const tokenMetadata = strategy.token_metadata[asset_type];
										if (!balance || !tokenMetadata) return null;
										const balanceFormatted = new BigNumber(balance.value);
										return (
											<li
												className='list-decimal'
												key={balance.id}
											>
												<p
													className='grid grid-cols-7 gap-2 m-0 text-sm'
												>
													<span>
														{name}
													</span>
													<span>
														{firstCharUppercase(network)}
													</span>
													<span>
														#{height}
													</span>
													<span>
														{threshold} {tokenMetadata.symbol}
													</span>
													<span>
														{balanceFormatted.toNumber().toFixed(1)} {tokenMetadata.symbol}
													</span>
													<span className='flex justify-center'>
														{weight}
													</span>
													<span>
														{new BigNumber(weight).multipliedBy(((balanceFormatted.gte(new BigNumber(threshold))? balanceFormatted: '0'))).toFixed(1)} VOTE
													</span>
												</p>
											</li>
										);
									})
								}
							</ul>
						</article>
					}
				>
					<p className='text-sm'>
						{
							proposal.voting_strategies_with_height.reduce((prev, strategy) => {
								let current = new BigNumber(0);
								const balance = vote.balances.find((item) => item.id === strategy.id);
								if (balance) {
									current = new BigNumber(balance.value);
								}
								if (strategy) {
									let weight = new BigNumber(strategy.weight);
									if (weight.eq(0)) {
										weight = new BigNumber(1);
									}
									current = current.multipliedBy(weight);
								}
								const result = calculateStrategy({
									...strategy,
									value: current.toString()
								});
								return prev.plus(result);
							}, new BigNumber(0)).toFixed(1)
						} VOTE
					</p>
				</Tooltip>
			</div>
			<p className='text-sm flex items-center justify-center gap-x-2'>
				{
					vote.options.length === 0
						? <span>
                            N/A
						</span>: vote.options.length === 1
							? <span>
								{
									vote.options[0].value
								}
							</span>: (
								<>
									<span>
										{vote.options[0].value}
									</span>
									<Tooltip
										color='#66A5FF'
										title={
											<ul
												className='m-0 pl-4 list-decimal'
											>
												{
													vote.options.map((option) => {
														return (
															<li
																key={option.value}
															>
																{option.value}
															</li>
														);
													})
												}
											</ul>
										}
									>
										<span
											className='text-xs text-grey_primary cursor-pointer'
										>
                                            +{vote.options.length - 1}
										</span>
									</Tooltip>
								</>
							)
				}
			</p>
		</article>
	);
};

export default Vote;