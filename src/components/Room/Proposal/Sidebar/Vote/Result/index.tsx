// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Progress } from 'antd';
import React, { FC } from 'react';
import { useProposalSelector } from '~src/redux/selectors';
import { getOptionPercentage, getTotalWeight } from '~src/utils/calculation/getStrategyWeight';

interface IVotingResultProps {}

const VotingResult: FC<IVotingResultProps> = () => {
	const { proposal } = useProposalSelector();
	if (!proposal) return null;
	const { votes_result } = proposal;

	return (
		<div
			className='pb-1'
		>
			<ul
				className='flex flex-col gap-y-8 list-none'
			>
				{
					Object.entries(votes_result).map(([key, value]) => {
						const optionTotal = Number(getTotalWeight(
							value.map(({ name, network }) => {
								return {
									name: name,
									network: network
								};
							}),
							value.map(({ network, amount }) => {
								return {
									balance: amount,
									network: network
								};
							})
						));
						const optionPercentage = getOptionPercentage(votes_result, key);
						return (
							<li
								key={key}
							>
								<div
									className='flex items-center justify-between gap-x-2'
								>
									<p>
										{key}
									</p>
									<p className='flex items-center gap-x-2'>
										<span>
                                            $ {isNaN(optionTotal)? 0: optionTotal}
										</span>
										<span>
											{isNaN(optionPercentage)? 0: optionPercentage.toFixed(1)}%
										</span>
									</p>
								</div>
								<div>
									<Progress
										className='m-0 p-0 flex items-center'
										percent={optionPercentage}
										showInfo={false}
										strokeColor='#E5007A'
										size="small"
									/>
								</div>
							</li>
						);
					})
				}
			</ul>
		</div>
	);
};

export default VotingResult;