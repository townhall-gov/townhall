// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Progress } from 'antd';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { IVotesResult } from '~src/types/schema';

interface IVotingResultProps {
	votes_result: IVotesResult;
	voted: BigNumber;
}

const VotingResult: FC<IVotingResultProps> = (props) => {
	const { votes_result, voted } = props;
	if (!votes_result) return null;

	return (
		<div
			className='pb-1'
		>
			<ul
				className='flex flex-col gap-y-8 list-none'
			>
				{
					Object.entries(votes_result).map(([key, value]) => {
						let total = new BigNumber(0);
						value.forEach(({ value }) => {
							total = total.plus(value);
						});
						const optionPercentage = total.div(voted).multipliedBy(100).toNumber();
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
											{total.toFixed(1)} VOTE
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