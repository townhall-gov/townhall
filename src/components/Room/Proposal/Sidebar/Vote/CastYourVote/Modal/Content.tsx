// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LoadingOutlined } from '@ant-design/icons';
import { Divider, Spin,Table, Tooltip } from 'antd';
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
import BlockchainIcon from '~src/ui-components/BlockchainIcon';
import { EBlockchain } from '~src/types/enums';
import { CircleArrowDownIcon, CircleArrowIcon, VotingPowerIcon } from '~src/ui-components/CustomIcons';
import { calculateStrategy } from '~src/utils/calculation/getStrategyWeight';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
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
	const { voteCreation, proposal, loading, error , isCastVoteTableVisible } = useProposalSelector();
	const dispatch = useDispatch();
	const { user } = useProfileSelector();
	const [columnData,setColumnData]=useState<ColumnsType<any>>([]);
	const isAllZero = checkIsAllZero(voteCreation.balances);
	const getFormattedBalance = (balance:any):BigNumber | null => {
		const token_info = balance.token_metadata[balance.asset_type];
		if (!token_info) {
			return null;
		}
		const balanceFormatted = new BigNumber(formatToken(balance.value || 0, !!evmChains[balance.network as keyof typeof evmChains], token_info.decimals));
		return balanceFormatted;
	};
	const getRowClassName = (record:IStrategyWithHeightAndBalance) => {
		const formattedBalance = getFormattedBalance(record)?.toNumber().toFixed(1);
		if (formattedBalance!=null && record.threshold <= formattedBalance) {
			return 'text-[#66A5FF]';
		}
		return '';
	};
	useEffect(() => {
		if (voteCreation.balances !== null) {
			const columns: ColumnsType<IStrategyWithHeightAndBalance> = [
				{
					dataIndex: 'name',
					key: 'name',
					render: (text,record) => <span className={getRowClassName(record)}>{text}</span>,
					title: <span className='text-base font-normal leading-tighter tracking-wide text-left'>{'Strategy'}</span>
				},
				{
					dataIndex: 'network',
					key: 'network',
					render: (text,record) => <span className={getRowClassName(record)}>
						<BlockchainIcon className={'text-md mr-1'} type={ text as EBlockchain }/>
						{firstCharUppercase(text)}</span>,
					title: <span className='text-base font-normal leading-tighter tracking-wide text-left'>{'Chain'}</span>
				},
				{
					dataIndex: 'height',
					key: 'height',
					render: (text,record) => <span className={getRowClassName(record)}># {text}</span>,
					title: <span className='text-base font-normal leading-tighter tracking-wide text-left'>{'Snapshot'}</span>
				},
				{
					dataIndex: 'threshold',
					key: 'threshold',
					render: (text,record) => <span className={getRowClassName(record)}>{text} {record?.token_metadata[record.asset_type]?.symbol}</span>,
					title: <span className='flex justify-start items-center gap-x-1'>
						<span className='text-base font-normal leading-tighter tracking-wide text-left'>{'Threshold'}</span>
						<span className='flex cursor-pointer items-center justify-center bg-grey_primary rounded-full text-[10px] text-white font-medium w-4 h-4'>
							<Tooltip
								color='#04152F'
								title={'Account with Balance >= Threshold can vote'}
							>
						?
							</Tooltip>
						</span>
					</span>
				},
				{
					dataIndex: 'id',
					key: 'id',
					render: (text,record) => <span className={getRowClassName(record)}>{getFormattedBalance(record)?.toNumber().toFixed(1)} {record?.token_metadata[record.asset_type]?.symbol}</span>,
					title: <span className='text-base font-normal leading-tighter tracking-wide text-left'>{'Balance'}</span>
				},
				{
					dataIndex: 'weight',
					key: 'weight',
					render: (text,record) => <span className={getRowClassName(record)}>{text}</span>,
					title: <span className='flex items-center gap-x-1'>
						<span className='text-base justify-start font-normal leading-tighter tracking-wide text-left'>{'Weight'}</span>
						<span className='flex cursor-pointer items-center justify-center bg-grey_primary rounded-full text-[10px] text-white font-medium w-4 h-4'>
							<Tooltip
								color='#04152F'
								title={'Voting weight refers to the level of influence Total = Balance * Weight'}
							>
							?
							</Tooltip>
						</span>
					</span>
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
						return <span className={getRowClassName(record)}>{result} VOTE</span>;
					},
					title:<span className='text-base font-normal leading-tighter tracking-wide text-left'>{'Total'}</span>
				}
			];
			setColumnData(columns);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [voteCreation.balances]);
	return (
		<section
			className='flex flex-col py-2 w-[787px]'
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
					<article className='mx-1 flex items-center'>
						<VotingPowerIcon className='text-grey_primary text-xl'/>
						<span className='text-base space-x-2 font-normal leading-normal tracking-wide text-left mx-2 '>{`Your total Voting Power:  ${
							voteCreation.balances.reduce((prev, strategy) => {
								let current = new BigNumber(0);
								const balance = getFormattedBalance(strategy);
								if (balance) {
									current = new BigNumber(balance);
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
						}`}

						</span>
						<span onClick={() => dispatch(proposalActions.setIsCastVoteTableVisible(!isCastVoteTableVisible))}>
							{
								isCastVoteTableVisible? <CircleArrowIcon className='text-2xl flex items-center text-transparent cursor-pointer' /> : <CircleArrowDownIcon className='text-2xl flex items-center text-transparent cursor-pointer'/>
							}
						</span>
					</article>
					{isCastVoteTableVisible && voteCreation.balances && <Table dataSource={voteCreation.balances} columns={columnData} pagination={false}/>}
					{isCastVoteTableVisible && <Divider className='bg-blue_primary' />}
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