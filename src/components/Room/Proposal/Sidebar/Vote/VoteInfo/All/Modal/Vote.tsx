// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Tooltip } from 'antd';
import React, { FC } from 'react';
import { useProposalSelector } from '~src/redux/selectors';
import { IVote } from '~src/types/schema';
import Address from '~src/ui-components/Address';
import { getStrategyWeight, getTotalWeight } from '~src/utils/calculation/getStrategyWeight';
import { chainProperties } from '~src/utils/networkConstants';

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
					color='#66A5FF'
					overlayClassName='min-w-max'
					title={
						<div>
							<div
								className='grid grid-cols-3 gap-x-5 pl-4 text-base font-medium'
							>
								<p>
                                    Strategy
								</p>
								<p>
                                    Network
								</p>
								<p>
                                    Total
								</p>
							</div>
							<ul
								className='m-0 pl-4 list-decimal'
							>
								{
									proposal.voting_strategies.map((strategy) => {
										const { name, network } = strategy;
										const total = getStrategyWeight(strategy, vote.balances);
										return (
											<li
												key={name + network}
											>
												<div
													className='grid grid-cols-3 gap-x-5 text-xs font-normal'
												>
													<p>
														{name}
													</p>
													<p>
														{network}
													</p>
													<p className='flex items-center gap-x-1'>
														<span>
                                                        ${total.toString()}
														</span>
														<span>
															{chainProperties?.[network]?.tokenSymbol}
														</span>
													</p>
												</div>
											</li>
										);
									})
								}
							</ul>
						</div>
					}
				>
					<p className='text-sm'>
                    $ {getTotalWeight(proposal.voting_strategies, vote.balances)}
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