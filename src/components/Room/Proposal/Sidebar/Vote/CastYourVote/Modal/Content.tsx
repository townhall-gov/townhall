// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LoadingOutlined } from '@ant-design/icons';
import { BN } from '@polkadot/util';
import { Spin } from 'antd';
import { IBalanceBody, IBalanceResponse } from 'pages/api/chain/actions/balance';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { IBalanceWithNetwork } from '~src/types/schema';
import Address from '~src/ui-components/Address';
import formatTokenAmount from '~src/utils/formatTokenAmount';
import { chainProperties } from '~src/utils/networkConstants';
import Option from '../Option';

const CastYourVoteModalContent = () => {
	const { voteCreation, proposal, loading } = useProposalSelector();
	const { user } = useProfileSelector();
	const dispatch = useDispatch();
	const isAllZero = voteCreation.balances.every((balance) => Number(balance.balance) === 0);

	useEffect(() => {
		(async () => {
			dispatch(proposalActions.setLoading(true));
			if (!proposal || !user) {
				dispatch(proposalActions.setLoading(false));
				return;
			}

			const { data, error } = await api.post<IBalanceResponse, IBalanceBody>('chain/actions/balance', {
				snapshot: proposal.snapshot_heights.map((v) => {
					return {
						address: user.address,
						height: v.height,
						network: v.blockchain
					};
				})
			});
			if (error) {
				console.log(error);
			} else if (data) {
				const balances = data.balances.map((v, i) => {
					const balance: IBalanceWithNetwork = {
						balance: 0,
						network: v.network || proposal?.snapshot_heights[i].blockchain
					};
					if (v.value) {
						if (v.value.free) {
							balance.balance = new BN(v.value.free).toString();
						}
						if (v.value.reserved) {
							balance.balance = new BN(v.value.reserved).add(new BN(balance.balance)).toString();
						}
					}
					return balance;
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

								proposal?.snapshot_heights.map((snapshot_height, index) => {
									const balance = voteCreation.balances.find((balance) => balance.network === snapshot_height.blockchain)?.balance;
									const balanceFormatted = formatTokenAmount(balance || 0, snapshot_height.blockchain);
									return (
										<li
											className='list-decimal'
											key={snapshot_height.height + index}
										>
											<p
												className='grid grid-cols-3 gap-2 m-0 text-sm'
											>
												<span>
													{snapshot_height.blockchain}
												</span>
												<span>
													# {snapshot_height.height}
												</span>
												<span>
													{Number(balanceFormatted).toFixed(2)} {chainProperties[snapshot_height.blockchain].tokenSymbol}
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