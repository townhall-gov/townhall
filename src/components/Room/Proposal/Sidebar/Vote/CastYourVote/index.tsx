// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import { HexWarningIcon } from '~src/ui-components/CustomIcons';
import { IBalanceResponse, IBalanceBody } from 'pages/api/chain/actions/balance';
import { proposalActions } from '~src/redux/proposal';
import api from '~src/services/api';

interface ICastYourVoteProps {}

const CastYourVote: FC<ICastYourVoteProps> = () => {
	const { proposal } = useProposalSelector();
	const dispatch = useDispatch();
	const { user } = useProfileSelector();
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();
	const [ votingTimer,setVotingTimer ] = useState({
		countDownVisibility: true,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	});
	useEffect(() => {
		if(proposal) {
			const { start_date }=proposal;
			const end = dayjs(start_date);
			const updateCountdown = () => {
				const remaining = end.diff(dayjs());
				if(remaining <= 0) {
					clearInterval(countdownInterval);
					setVotingTimer({ ...votingTimer, countDownVisibility: false });
				} else {
					const duration = dayjs.duration(remaining);
					const days = duration.days();
					const hours = duration.hours();
					const minutes = duration.minutes();
					const seconds = duration.seconds();

					setVotingTimer({
						...votingTimer,
						days: days,
						hours: hours,
						minutes: minutes,
						seconds: seconds
					});
				}
			};
			const countdownInterval = setInterval(updateCountdown, 1000);
			updateCountdown();
			return () => {
				clearInterval(countdownInterval);
			};
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[proposal]);

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

	if (!proposal) return null;
	const { start_date } = proposal;

	return (
		<div
			className='flex flex-col justify-center p-6 gap-y-4 border border-solid border-blue_primary rounded-2xl'
		>
			{
				dayjs().isBefore(dayjs(start_date)) && votingTimer.countDownVisibility?
					<section className='drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] text-white'>
						<h2 className='font-bold text-lg leading-[22px] tracking-[0.01em] mb-[21px]'>
				Voting Starts in
						</h2>
						<div className='flex justify-between text-[32px] text-[#66A5FF] mx-2'>
							<article className='flex flex-col gap-y-1.5 items-center'>
								<p className='font-bold'> { votingTimer.days } </p>
								<span className='text-sm font-normal'> Days </span>
							</article>
							<article className='flex flex-col gap-y-1.5 items-center'>
								<p className='font-bold'> : </p>
								<span className='text-sm font-normal'></span>
							</article>
							<article className='flex flex-col gap-y-1.5 items-center'>
								<p className='font-bold'> { votingTimer.hours } </p>
								<span className='text-sm font-normal'> Hours </span>
							</article>
							<article className='flex flex-col gap-y-1.5 items-center'>
								<p className='font-bold'> : </p>
								<span className='text-sm font-normal'></span>
							</article>
							<article className='flex flex-col gap-y-1.5 items-center'>
								<p className='font-bold'> { votingTimer.minutes } </p>
								<span className='text-sm font-normal'> Minutes </span>
							</article>
							<article className='flex flex-col gap-y-1.5 items-center'>
								<p className='font-bold'>:</p>
								<span className='text-sm font-normal'></span>
							</article>
							<article className='flex flex-col gap-y-1.5 items-center'>
								<p className='font-bold'> { votingTimer.seconds } </p>
								<span className='text-sm font-normal'> Seconds </span>
							</article>
						</div>
					</section>
					: (
						<>

							<h3 className='m-0 font-extrabold text-[18px] leading-[22px] text-white'>Make a Decision!</h3>
							<button
								className={
									classNames('bg-blue_primary outline-none border border-solid border-blue_primary py-[6.5px] text-white font-bold text-base leading-[20px] rounded-2xl flex-1 w-full cursor-pointer')
								}
								onClick={() => {
									if (!isLoggedIn) {
										connectWallet();
										return;
									}
									if (!isRoomJoined) {
										joinRoom();
										return;
									}
									dispatch(modalActions.setModal({
										contentType: EContentType.CAST_YOUR_VOTE,
										footerType: EFooterType.CAST_YOUR_VOTE,
										open: true,
										titleType: ETitleType.CAST_YOUR_VOTE
									}));
								}}
							>
							Cast your Vote!
							</button>
							{
								proposal.is_vote_results_hide_before_voting_ends?
									<div className='flex items-center gap-x-[6px]'>
										<HexWarningIcon className='text-[20px] stroke-white' />
										<p className='p-0 m-0 text-sm leading-[17px] text-white'>
									Results are hidden till Voting ends.
										</p>
									</div>
									: null
							}

						</>
					)
			}
		</div>
	);
};

export default CastYourVote;