// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Card, Divider, Dropdown, Progress } from 'antd';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { IVotesResult } from '~src/types/schema';
import { SortByDownIcon } from '~src/ui-components/CustomIcons';

interface IProposalResultProps {
    btnRef: React.MutableRefObject<HTMLButtonElement>;
    votes_result: IVotesResult;
}

const ProposalResult: FC<IProposalResultProps> = (props) => {
	const { btnRef, votes_result } = props;
	const [open, setOpen] = useState(false);
	const [voted, setVoted] = useState(new BigNumber(0));
	useEffect(() => {
		let voted = new BigNumber(0);
		Object.entries(votes_result).forEach(([, balances]) => {
			balances.forEach(({ value }) => {
				voted = voted.plus(value);
			});
		});
		setVoted(voted);
	}, [votes_result]);
	return (
		<button
			ref={btnRef}
			className='bg-transparent cursor-pointer flex items-center justify-center border-none outline-none'
		>
			<Dropdown
				onOpenChange={(open) => {
					setOpen(open);
				}}
				trigger={['click']}
				overlayClassName='ant-dropdown-menu-border-blue_primary'
				dropdownRender={() => {
					return (
						<Card className='min-w-[265px] overflow-y-auto border border-solid border-blue_primary'>
							<div
								className='py-[19.66px] px-[21.37px]'
							>
								<h2 className='m-0 p-0 pb-[12.35px] text-white font-extrabold text-base leading-[20px] tracking-[0.01em]'>
                                    Results
								</h2>
								<div>
									<p className='flex m-0 items-center gap-x-2 justify-between text-white font-light text-sm leading-[17px] tracking-[0.02em]'>
										<span>
                                            Voted
										</span>
										<span>
											{voted.toString()}
										</span>
									</p>
								</div>
								<Divider className='m-0 mt-[18px] mb-[15px] bg-blue_primary' />
								<ul
									className='flex flex-col gap-y-8 list-none'
								>
									{
										Object.entries(votes_result).map(([key, value], index) => {
											let total = new BigNumber(0);
											value.forEach(({ value }) => {
												total = total.plus(value);
											});
											const optionPercentage = total.div(voted).multipliedBy(100).toNumber();
											return (
												<li
													key={index}
												>
													<div
														className='text-white text-sm font-light leading-[17px] tracking-[0.01em] mb-[5px]'
													>
                                                        # {index + 1}
													</div>
													<div
														className='flex items-center justify-between gap-x-2 text-[#90A0B7] font-medium text-xs leading-[22px]'
													>
														<p className='flex items-center gap-x-2'>
															{isNaN(optionPercentage)? 0: optionPercentage.toFixed(1)}%
														</p>
														<p>
															{key}
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
						</Card>
					);
				}}
			>
				<SortByDownIcon className={
					classNames('text-2xl text-transparent', {
						'stroke-grey_tertiary': !open,
						'stroke-white': open
					})
				} />
			</Dropdown>
		</button>
	);
};

export default ProposalResult;