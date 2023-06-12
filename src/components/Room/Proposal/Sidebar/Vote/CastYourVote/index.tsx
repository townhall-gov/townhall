// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { useProposalSelector } from '~src/redux/selectors';
import { HexWarningIcon } from '~src/ui-components/CustomIcons';

interface ICastYourVoteProps {}

const CastYourVote: FC<ICastYourVoteProps> = () => {
	const { proposal } = useProposalSelector();
	const dispatch = useDispatch();
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();
	if (!proposal) return null;
	const { start_date } = proposal;

	return (
		<div
			className='flex flex-col justify-center p-6 gap-y-4 border border-solid border-blue_primary rounded-2xl'
		>
			{
				dayjs().isBefore(dayjs(start_date))?
					<p className='m-0 font-medium text-base leading-[21px] text-center text-white'>
					Voting hasn{"'"}t started yet.
					</p>
					: (
						<>

							<h3 className='m-0 font-extrabold text-[18px] leading-[22px] text-white'>Make a discussion!</h3>
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