// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { IBalanceBody, IBalanceResponse, IStrategyWithHeightAndBalance } from 'pages/api/chain/actions/balance';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import Address from '~src/ui-components/Address';
import { formatToken } from '~src/utils/formatTokenAmount';
import Option from '../Option';
import { evmChains } from '~src/onchain-data/networkConstants';
import BigNumber from 'bignumber.js';

export const NoOptionsSelectedError = 'Please select at least one option';

export const checkIsAllZero = (balances: IStrategyWithHeightAndBalance[]) => {
	return balances.every((balance) => {
		const weight = new BigNumber(balance.weight);
		if (!weight.gt(0)) {
			return true;
		}
		const tokenMetadata = balance.token_metadata[balance.asset_type];
		if (!tokenMetadata) return true;
		const value = new BigNumber(formatToken(balance.value, !!evmChains[balance.network as keyof typeof evmChains], tokenMetadata?.decimals));
		const votes = (value).multipliedBy(weight);
		const threshold = new BigNumber(balance.threshold);
		return votes.lt(threshold);
	});
};

const CastYourVoteModalContent = () => {
	const { voteCreation, proposal, loading, error } = useProposalSelector();
	const { user } = useProfileSelector();
	const dispatch = useDispatch();
	const isAllZero = checkIsAllZero(voteCreation.balances);

	useEffect(() => {
		(async () => {
			dispatch(proposalActions.setLoading(true));
			if (!proposal || !user) {
				dispatch(proposalActions.setLoading(false));
				return;
			}

			const { data, error } = await api.post<IBalanceResponse, IBalanceBody>('chain/actions/balance', {
				address: user.address,
				voting_strategies_with_height: proposal.voting_strategies_with_height
			});
			if (error) {
				console.log(error);
			} else if (data) {
				const balances = data.balances.map((v) => {
					return v;
				});
				dispatch(proposalActions.setVoteCreation_Field({
					key: 'balances',
					value: balances
				}));
			}
			dispatch(proposalActions.setLoading(false));
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

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
							className='text-grey_primary text-base font-medium m-0 grid grid-cols-3 gap-2'
						>
							<span>Network</span>
							<span className='pl-2'>Snapshot</span>
							<span className='pl-2'>Balance</span>
						</h4>
						<ul
							className='m-0 list-decimal pl-4'
						>
							{

								voteCreation.balances.map((balance) => {
									const token_info = balance.token_metadata[balance.asset_type];
									if (!token_info) {
										return null;
									}
									let balanceFormatted = new BigNumber(formatToken(balance.value || 0, !!evmChains[balance.network as keyof typeof evmChains], token_info.decimals));
									balanceFormatted = balanceFormatted.multipliedBy(new BigNumber(balance.weight));
									return (
										<li
											className='list-decimal'
											key={balance.id}
										>
											<p
												className='grid grid-cols-3 gap-2 m-0 text-sm'
											>
												<span>
													{balance.network}
												</span>
												<span>
													# {balance.height}
												</span>
												<span>
													{balanceFormatted.toNumber().toFixed(2)} {token_info.symbol}
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
										Insufficient balance, you can not vote from this account, please logged in with another account.
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