// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LoadingOutlined } from '@ant-design/icons';
import { Spin,Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import Address from '~src/ui-components/Address';
import { formatToken } from '~src/utils/formatTokenAmount';
import Option from '../Option';
import { evmChains } from '~src/onchain-data/networkConstants';
import BigNumber from 'bignumber.js';
import { firstCharUppercase } from '~src/utils/getFirstCharUppercase';
import { IStrategyWithHeightAndBalance } from 'pages/api/chain/actions/balance';
import type { ColumnsType } from 'antd/es/table';
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
	const [columnData,setColumnData]=useState<ColumnsType<any>>([]);
	const isAllZero = checkIsAllZero(voteCreation.balances);
	useEffect(() => {
		if (voteCreation.balances !== null) {
			const getFormattedBalance = (balance:any):BigNumber | null => {
				const token_info = balance.token_metadata[balance.asset_type];
				if (!token_info) {
					return null;
				}
				const balanceFormatted = new BigNumber(formatToken(balance.value || 0, !!evmChains[balance.network as keyof typeof evmChains], token_info.decimals));
				return balanceFormatted;
			};
			const columns: ColumnsType<any> = [
				{
					dataIndex: 'name',
					key: 'name',
					render: (text) => <span>{text}</span>,
					title: 'Strategy'
				},
				{
					dataIndex: 'network',
					key: 'network',
					render: (text) => <span>{firstCharUppercase(text)}</span>,
					title: 'Chain'
				},
				{
					dataIndex: 'height',
					key: 'height',
					render: (text) => <span># {text}</span>,
					title: 'Snapshot'
				},
				{
					dataIndex: 'threshold',
					key: 'threshold',
					render: (text,record) => <span>{text} {record.token_metadata[record.asset_type].symbol}</span>,
					title: 'Threshold'
				},
				{
					dataIndex: 'id',
					key: 'id',
					render: (text,record) => <span>{getFormattedBalance(record)?.toNumber().toFixed(1)} {record.token_metadata[record.asset_type].symbol}</span>,
					title: 'Balance'
				},
				{
					dataIndex: 'weight',
					key: 'weight',
					render: (text) => <span>{text}</span>,
					title: 'Weight'
				},
				{
					dataIndex: 'total',
					key: 'total',
					render: (type,record) =>
					{
						const formattedBalance = getFormattedBalance(record);
						const balance = formattedBalance !== null ? formattedBalance : new BigNumber(0);
						const weight = new BigNumber(record.weight);
						const threshold = new BigNumber(record.threshold);
						const multipliedValue = weight.multipliedBy(balance.gte(threshold) ? balance : new BigNumber(0));
						const result = multipliedValue.toFixed(1);
						return <span>{result} VOTE</span>;
					},
					title: 'Total'
				}
			];
			setColumnData(columns);
		}
	}, [voteCreation.balances]);
	console.log(voteCreation.balances);
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
					{voteCreation.balances && <Table dataSource={voteCreation.balances} columns={columnData} pagination={false}/>}
					<article
						className='flex flex-col gap-y-2'
					></article>
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
				</Spin>
			</div>
		</section>
	);
};

export default CastYourVoteModalContent;