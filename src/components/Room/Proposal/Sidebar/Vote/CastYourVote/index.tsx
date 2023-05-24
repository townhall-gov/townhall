// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import dayjs from 'dayjs';
import { IVotingSystemOption } from '~src/redux/room/@types';
import Option from './Option';
import classNames from 'classnames';
import { IVoteCreation } from '~src/redux/proposal/@types';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';

interface ICastYourVoteProps {
    start_date: Date;
    voting_system_options: IVotingSystemOption[];
	voteCreation: IVoteCreation;
}

const CastYourVote: FC<ICastYourVoteProps> = (props) => {
	const { start_date, voting_system_options, voteCreation } = props;
	const dispatch = useDispatch();
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();
	if (dayjs().isBefore(dayjs(start_date))) {
		return (
			<p className='m-0 font-normal text-sm leading-[17px] text-center'>
                Voting hasn{"'"}t started yet.
			</p>
		);
	}

	return (
		<div
			className='flex flex-col items-center justify-center gap-y-[28.5px]'
		>
			<section
				className='grid grid-cols-2 gap-[13.5px] flex-1 w-full'
			>
				{
					voting_system_options.map((option, index) => {
						return (
							<Option
								connectWallet={connectWallet}
								isLoggedIn={isLoggedIn}
								isRoomJoined={isRoomJoined}
								joinRoom={joinRoom}
								option={option}
								key={option.value + index}
							/>
						);
					})
				}
			</section>
			<button
				disabled={voteCreation.options.length === 0}
				className={
					classNames('bg-blue_primary outline-none border border-solid border-blue_primary py-[6.5px] text-white font-bold text-base leading-[20px] rounded-2xl flex-1 w-full', {
						'cursor-not-allowed': voteCreation.options.length === 0,
						'cursor-pointer': voteCreation.options.length != 0
					})
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
		</div>
	);
};

export default CastYourVote;