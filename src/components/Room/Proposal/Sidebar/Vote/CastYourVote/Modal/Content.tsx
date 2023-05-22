// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { BN } from '@polkadot/util';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import { IBalanceWithNetwork } from '~src/types/schema';
import formatTokenAmount from '~src/utils/formatTokenAmount';
import getErrorMessage from '~src/utils/getErrorMessage';

const CastYourVoteModalContent = () => {
	const { voteCreation, proposal } = useProposalSelector();
	const { user } = useProfileSelector();
	const dispatch = useDispatch();
	useEffect(() => {
		if (voteCreation.options.length > 0) {
			(async () => {
				dispatch(proposalActions.setLoading(true));
				if (!proposal || !user) {
					dispatch(proposalActions.setLoading(false));
					return;
				}
				const promises: Promise<any>[] = [];
				proposal.snapshot_heights.forEach((snapshot_height) => {
					promises.push(
						Promise.race([
							fetch(`${process.env.NEXT_PUBLIC_ONCHAIN_DATA_ENDPOINT}/api/${snapshot_height.blockchain}/balance?address=${user.address}&height=${snapshot_height.height}`),
							new Promise((_, reject) =>
								setTimeout(() => reject(new Error('timeout')), 60 * 1000)
							)
						])
					);
				});
				const fetchHeightsPromiseSettledResult = await Promise.allSettled(promises);
				const heightsPromiseSettledResult = await Promise.allSettled(fetchHeightsPromiseSettledResult.map(async (promiseSettledResult, i) => {
					if (promiseSettledResult && promiseSettledResult.status === 'fulfilled' && promiseSettledResult.value) {
						const res = await promiseSettledResult.value.json();
						const balance: IBalanceWithNetwork = {
							balance: 0,
							network: proposal?.snapshot_heights[i].blockchain
						};
						if (res) {
							if (res.free) {
								balance.balance = new BN(res.free).toString();
							}
							if (res.reserved) {
								balance.balance = new BN(res.reserved).add(new BN(balance.balance)).toString();
							}
							try {
								balance.balance = await formatTokenAmount(balance.balance, balance.network);
							} catch (error) {
								dispatch(proposalActions.setError(getErrorMessage(error)));
							}
						}
						return balance;
					}
				}));
				const balances:IBalanceWithNetwork[] = [];
				heightsPromiseSettledResult.forEach((promiseSettledResult) => {
					if (promiseSettledResult && promiseSettledResult.status === 'fulfilled' && promiseSettledResult.value) {
						balances.push(promiseSettledResult.value);
					}
				});
				dispatch(proposalActions.setVoteCreation_Field({
					key: 'balances',
					value: balances
				}));
			})();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<section
			className='flex flex-col gap-y-3 py-3'
		>
			<h4
				className='flex items-center justify-between text-base font-medium'
			>
				<span
					className='text-grey_primary'
				>
                    Choices
				</span>
				<span>
					{voteCreation.options.map((option) => (option.value)).join(', ')}
				</span>
			</h4>
			<article
				className='flex flex-col gap-y-2'
			>
				<h4
					className='text-grey_primary text-base font-medium m-0'
				>
                    Snapshot
				</h4>
				<ul
					className='m-0 list-decimal pl-4'
				>
					{

						proposal?.snapshot_heights.map((snapshot_height, index) => {
							return (
								<li
									className='list-decimal'
									key={snapshot_height.height + index}
								>
									<p
										className='flex items-center justify-between m-0 text-sm'
									>
										<span>
											{snapshot_height.blockchain}
										</span>
										<span>
                                            # {snapshot_height.height}
										</span>
									</p>
								</li>
							);
						})
					}
				</ul>
			</article>
		</section>
	);
};

export default CastYourVoteModalContent;