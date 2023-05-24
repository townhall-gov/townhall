// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import dayjs from 'dayjs';
import React from 'react';
import { useProposalSelector } from '~src/redux/selectors';

const Timestamp = () => {
	const { proposal } = useProposalSelector();
	if (!proposal) return null;
	const { snapshot_heights, created_at, start_date, end_date } = proposal;
	return (
		<section
			className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white'
		>
			<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[15px]'>
                Time Stamp
			</h2>
			<div className='flex flex-col gap-y-[10px] leading-[22px] font-normal tracking-[0.02em]'>
				{
					snapshot_heights?.length?
						<p className='grid grid-cols-2 gap-x-1 m-0 items-center'>
							<span className='col-span-1 text-sm text-grey_primary'>
                                Block number
							</span>
							<span className='col-span-1 text-end text-xs'>
                                #{snapshot_heights?.[0]?.height}
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