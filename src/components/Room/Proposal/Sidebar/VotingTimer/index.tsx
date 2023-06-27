// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { useProposalSelector } from '~src/redux/selectors';
import dayjs from 'dayjs';

const VotingTimer = () => {
	const { proposal } = useProposalSelector();
	const [ votingTimer,setVotingTimer ] = useState({ countDownVisbility:true,days:0,hours:0,minutes:0,seconds:0 });
	useEffect(() => {
		if(proposal)
		{
			const { start_date }=proposal;
			const end = dayjs( start_date );
			const updateCountdown = () => {
				const remaining = end.diff( dayjs() );
				if( remaining<=0 ) {
					clearInterval( countdownInterval );
					setVotingTimer({ ...votingTimer,countDownVisbility:false });
				}
				else {
					const duration = dayjs.duration( remaining );
					const days = duration.days();
					const hours = duration.hours();
					const minutes = duration.minutes();
					const seconds = duration.seconds();

					setVotingTimer(
						{
							...votingTimer,days:days,hours:hours,minutes:minutes,seconds:seconds
						}
					);
				}
			};
			updateCountdown();
			const countdownInterval = setInterval( updateCountdown, 1000 );
			return () => {
				clearInterval( countdownInterval );
			};
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[proposal]);
	return (
		<>
			{ votingTimer.countDownVisbility && (
				<section className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white'>
					<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[21px]'>
				Voting Starts in
					</h2>
					<div className='flex justify-between text-[32px] text-[#66A5FF] mx-2'>
						<article className='flex flex-col gap-y-5 items-center'>
							<p className='font-bold'> {votingTimer.days} </p>
							<span className='text-sm font-normal'> Days </span>
						</article>
						<article className='flex flex-col gap-y-5'>
							<p className='font-bold'> : </p>
							<span className='text-sm font-normal'></span>
						</article>
						<article className='flex flex-col gap-y-5 items-center'>
							<p className='font-bold'> {votingTimer.hours} </p>
							<span className='text-sm font-normal'> Hours </span>
						</article>
						<article className='flex flex-col gap-y-5'>
							<p className='font-bold'> : </p>
							<span className='text-sm font-normal'></span>
						</article>
						<article className='flex flex-col gap-y-5 items-center'>
							<p className='font-bold'> {votingTimer.minutes} </p>
							<span className='text-sm font-normal'> Minutes </span>
						</article>
						<article className='flex flex-col gap-y-5'>
							<p className='font-bold'>:</p>
							<span className='text-sm font-normal'></span>
						</article>
						<article className='flex flex-col gap-y-5 items-center'>
							<p className='font-bold'> {votingTimer.seconds} </p>
							<span className='text-sm font-normal'> Seconds </span>
						</article>
					</div>
				</section>
			)}
		</>
	);

};

export default VotingTimer;