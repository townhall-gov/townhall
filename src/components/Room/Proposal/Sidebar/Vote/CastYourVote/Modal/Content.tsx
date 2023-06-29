// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import React from 'react';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import Address from '~src/ui-components/Address';
import { formatToken } from '~src/utils/formatTokenAmount';
import Option from '../Option';
import { evmChains } from '~src/onchain-data/networkConstants';
import BigNumber from 'bignumber.js';
import { firstCharUppercase } from '~src/utils/getFirstCharUppercase';
import { IStrategyWithHeightAndBalance } from 'pages/api/chain/actions/balance';

export const NoOptionsSelectedError = 'Please select at least one option';

export const checkIsAllZero = (balances: IStrategyWithHeightAndBalance[]) => {
	return balances.every((balance) => {
		const tokenMetadata = balance.token_metadata[balance.asset_type];
		if (!tokenMetadata) return true;
		const value = new BigNumber(formatToken(balance.value, !!evmChains[balance.network as keyof typeof evmChains], tokenMetadata?.decimals));
		const threshold = new BigNumber(balance.threshold);
		return value.lt(threshold);
	});
};

const CastYourVoteModalContent = () => {
	const { voteCreation, proposal, loading, error } = useProposalSelector();
	const { user } = useProfileSelector();
	const isAllZero = checkIsAllZero(voteCreation.balances);

	return (
		<section
			className='flex flex-col py-2'
		>
			<h4
				className='text-grey_primary font-normal text-sm leading-[21px] m-0'
			>
				Choose your vote
			</h4>
			{
				proposal && proposal.voting_system_options && proposal.voting_system_options.length && Array.isArray(proposal.voting_system_options)?
					<div className='flex flex-col gap-y-3 mt-[7px]'>
						{
							proposal?.voting_system_options.map((option, index) => {
								return (
									<Option
										key={index}
										index={index + 1}
										option={option}
									/>
								);
							})
						}
					</div>
					: null
			}
			{
				error === NoOptionsSelectedError?
					<p className='text-red_primary m-0 mt-2 text-xs'>{NoOptionsSelectedError}</p>
					: null
			}
			<div className='mt-5'>
				<Spin
					className='bg-dark_blue_primary'
					spinning={loading}
					indicator={<LoadingOutlined />}
				>
					<article
						className='flex flex-col gap-y-2'
					>
						<h4
							className='text-grey_primary text-base font-medium m-0 grid grid-cols-7 gap-2 pl-5'
						>
							<span>Strategy</span>
							<span>Chain</span>
							<span>Snapshot</span>
							<span className='flex items-center gap-x-1'>
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
							<span>Balance</span>
							<span className='flex items-center gap-x-1'>
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
							<span>Total</span>
						</h4>
						<ul
							className='m-0 list-decimal pl-5'
						>
							{

								voteCreation.balances.map((balance) => {
									const token_info = balance.token_metadata[balance.asset_type];
									if (!token_info) {
										return null;
									}
									const balanceFormatted = new BigNumber(formatToken(balance.value || 0, !!evmChains[balance.network as keyof typeof evmChains], token_info.decimals));
									return (
										<li
											className='list-decimal'
											key={balance.id}
										>
											<p
												className='grid grid-cols-7 gap-2 m-0 text-sm'
											>
												<span>
													{balance.name}
												</span>
												<span>
													{firstCharUppercase(balance.network)}
												</span>
												<span>
													#{balance.height}
												</span>
												<span>
													{balance.threshold} {token_info.symbol}
												</span>
												<span>
													{balanceFormatted.toNumber().toFixed(1)} {token_info.symbol}
												</span>
												<span>
													{balance.weight}
												</span>
												<span>
													{new BigNumber(balance.weight).multipliedBy(((balanceFormatted.gte(new BigNumber(balance.threshold))? balanceFormatted: '0'))).toFixed(1)} VOTE
												</span>
											</p>
										</li>
									);
								})
							}
						</ul>
						{
							isAllZero && user?.address && (
								<div
									className='flex flex-col gap-y-2 mt-5'
								>
									<p
										className='text-sm text-red-500'
									>
										Insufficient tokens, you can not vote from this account, please logged in with another account.
									</p>
									<Address
										ethIdenticonSize={20}
										identiconSize={20}
										address={user?.address}
									/>
								</div>
							)
						}
					</article>
				</Spin>
			</div>
		</section>
	);
};

export default CastYourVoteModalContent;