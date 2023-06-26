// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { useProposalSelector } from '~src/redux/selectors';
import dayjs from 'dayjs';

const VotingTimer = () => {
	const { proposal } = useProposalSelector();
	const [ votingTimer,setVotingTimer ] = useState({ countDownVisbility:true,days:0,hours:0,minutes:0,seconds:0 });
	const countDownUpdation = () => {
		if(proposal)
		{
			const { start_date }=proposal;
			const end = dayjs( start_date );
			const updateCountdown = () => {
				const remaining = end.diff(dayjs());
				if(remaining<=0)
				{
					setVotingTimer({ ...votingTimer,countDownVisbility:false });
				}
				else {
					const duration = dayjs.duration(remaining);
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
			if(votingTimer.countDownVisbility)
			{
				const countdownInterval = setInterval(updateCountdown, 1000);
				return () => {
					clearInterval(countdownInterval);
				};
			}
		}
	};
	useEffect(() => {
		countDownUpdation();
	},[proposal]);
	return (
		<>
			{votingTimer.countDownVisbility && (
				<section className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white'>
					<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[21px]'>
				Voting Starts in
					</h2>
					<div className='flex flex-col text-[#66A5FF] items-center justify-between'>
						<div className='flex justify-between text-[32px] text-[#66A5FF]'>
							<p className='flex flex-col justify-center font-bold items-center text-[32px]'>
								{votingTimer.days}
								<span className='text-[14px] gap-y-[5px] font-normal'>Days</span>
							</p>
							<div className='mx-2'>:</div>
							<p className='flex flex-col justify-center font-bold items-center text-[32px]'>
								{votingTimer.hours}
								<span className='text-[14px] gap-y-[5px] font-normal'>Hours</span>
							</p>
							<div  className='mx-2'>:</div>
							<p className='flex flex-col justify-center font-bold items-center text-[32px]'>
								{votingTimer.minutes}
								<span className='text-[14px] gap-y-[5px] font-normal'>Minutes</span>
							</p>
							<div  className='mx-2'>:</div>
							<p className='flex flex-col justify-center font-bold items-center text-[32px]'>
								{votingTimer.seconds}
								<span className='text-[14px] gap-y-[5px] font-normal'>Seconds</span>
							</p>
						</div>
					</div>
				</section>
			)}
		</>
	);

};

export default VotingTimer;