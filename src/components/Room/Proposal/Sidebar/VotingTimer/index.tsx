// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { useProposalSelector } from '~src/redux/selectors';

const VotingTimer = () => {
	const { proposal } = useProposalSelector();
	const [votingTimer,setvotingTimer] = useState({ days:0,hours:0,minutes:0,seconds:0 });
	useEffect(() => {
		if(proposal)
		{
			const { start_date }=proposal;
			//const start = new Date(created_at).getTime();
			const end = new Date(start_date).getTime();
			const updateCountdown = () => {
				const current = new Date().getTime();
				const remaining = end - current;

				if(remaining>0) {
					const seconds = Math.floor((remaining / 1000) % 60);
					const minutes = Math.floor((remaining / (1000 * 60)) % 60);
					const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
					const days = Math.floor(remaining / (1000 * 60 * 60 * 24));

					setvotingTimer(
						{
							...votingTimer,days:days,hours:hours,minutes:minutes,seconds:seconds
						}
					);
				}
			};

			// Initial countdown update
			updateCountdown();

			// Update countdown every second
			const countdownInterval = setInterval(updateCountdown, 1000);

			return () => {
				clearInterval(countdownInterval);
			};
		}
	},[proposal]);
	return (
		<section
			className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white'
		>
			<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[21px]'>
                Voting Starts in
			</h2>
			<div className='flex flex-col text-[#66A5FF]items-center justify-between '>
				<div className='flex justify-between text-[32px]  mx-2 text-[#66A5FF]'>
					<div className='flex flex-col justify-center font-bold  items-center text-[32px]'>{votingTimer.days}
						<div className='text-[14px] mt-[5px] font-normal'>Days</div>
					</div>
					<div>:</div>

					<div className='flex flex-col justify-center font-bold  items-center text-[32px]'>{votingTimer.hours}
						<div className='text-[14px] mt-[5px] font-normal'>Hours</div>
					</div>
					<div>:</div>

					<div className='flex flex-col justify-center font-bold items-center text-[32px]'>{votingTimer.minutes}
						<div className='text-[14px] mt-[5px] font-normal'>Minutes</div>
					</div>
					<div>:</div>

					<div className='flex flex-col justify-center font-bold  items-center text-[32px]'>{votingTimer.seconds}
						<div className='text-[14px] mt-[5px] font-normal'>Seconds</div>
					</div>

				</div>
			</div>
		</section>
	);
};

export default VotingTimer;