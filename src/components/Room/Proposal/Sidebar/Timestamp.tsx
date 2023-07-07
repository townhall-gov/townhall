// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Popover } from 'antd';
import dayjs from 'dayjs';
import { useProposalSelector } from '~src/redux/selectors';
import { EBlockchain } from '~src/types/enums';
import BlockchainIcon from '~src/ui-components/BlockchainIcon';
import { firstCharUppercase } from '~src/utils/getFirstCharUppercase';

const Timestamp = () => {
	const { proposal } = useProposalSelector();
	if (!proposal) return null;
	const { voting_strategies_with_height, created_at, start_date, end_date } = proposal;
	const uniqueNetworks:{[key:string]:boolean}={ };
	const new_voting_strategies_with_height = voting_strategies_with_height.filter((strategy) => {
		if (uniqueNetworks[strategy.network]) {
			return false;
		}
		uniqueNetworks[strategy.network] = true;
		return true;
	});
	const content = (
		<div className='text-[#0E2D59] text-xs'>
			<article className='grid grid-cols-2 font-bold mb-1.5'>
				<span>Network</span>
				<span>Snapshot</span>
			</article>
			<article className='grid grid-cols-2'>
				{new_voting_strategies_with_height.map((strategy,index) => {
					return (
						<div className='col-span-2 ' key={index}>
							<article className='grid grid-cols-2' key={index}>
								<p className='col-span-1 my-1.5 mr-3'>
									<BlockchainIcon className={'text-md mr-1'} type={ strategy.network as EBlockchain }/>
									<span>{firstCharUppercase(strategy.network)}</span>
								</p>
								<span className='col-span-1 my-1.5'># {strategy.height}</span>
							</article>
						</div>
					);
				})}
			</article>
		</div>
	);
	return (
		<section
			className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white'
		>
			<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[15px]'>
                Time Stamp
			</h2>
			<div className='flex flex-col gap-y-[10px] leading-[22px] font-normal tracking-[0.02em]'>
				{
					voting_strategies_with_height?.length?
						<p className='grid grid-cols-3 gap-x-1 m-0 items-center'>
							<span className='col-span-2 text-sm text-grey_primary'>
                                Block number
							</span>
							<span className='col-span-1 flex justify-end items-center gap-1 text-xs'>
								<span>#{voting_strategies_with_height?.[0]?.height}</span>
								<Popover content={content} trigger="click">
									<span
										className='text-xs text-black rounded-2xl bg-[#66A5FF] px-[8px] py-[2px] cursor-pointer'
									>
                                            +{new_voting_strategies_with_height?.length }
									</span>
								</Popover>
							</span>
						</p>
						: null
				}
				{
					created_at?
						<p className='grid grid-cols-2 gap-x-1 m-0 items-center'>
							<span className='col-span-1 text-sm text-grey_primary'>
                                Created
							</span>
							<span className='col-span-1 text-end text-xs'>
								{dayjs(created_at).format('MMM D, YYYY HH:mm')}
							</span>
						</p>
						: null
				}
				{
					start_date?
						<p className='grid grid-cols-2 gap-x-1 m-0 items-center'>
							<span className='col-span-1 text-sm text-grey_primary'>
                                Voting Start Date
							</span>
							<span className='col-span-1 text-end text-xs'>
								{dayjs(start_date).format('MMM D, YYYY HH:mm')}
							</span>
						</p>
						: null
				}
				{
					end_date?
						<p className='grid grid-cols-2 gap-x-1 m-0 items-center'>
							<span className='col-span-1 text-sm text-grey_primary'>
                                Voting End Date
							</span>
							<span className='col-span-1 text-end text-xs'>
								{dayjs(end_date).format('MMM D, YYYY HH:mm')}
							</span>
						</p>
						: null
				}
			</div>
		</section>
	);
};

export default Timestamp;