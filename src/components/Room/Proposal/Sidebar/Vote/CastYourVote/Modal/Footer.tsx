// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Divider } from 'antd';
import classNames from 'classnames';
import { IVoteBody, IVoteResponse, TVotePayload } from 'pages/api/auth/actions/vote';
import React from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { proposalActions } from '~src/redux/proposal';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import getErrorMessage from '~src/utils/getErrorMessage';
import { signApiData } from '~src/utils/sign';

const CastYourVoteModalFooter = () => {
	const dispatch = useDispatch();
	const { connectWallet, isLoggedIn, isRoomJoined, joinRoom } = useAuthActionsCheck();
	const { voteCreation, loading, proposal } = useProposalSelector();
	const { user } = useProfileSelector();
	if (!proposal) return null;
	const isAllZero = voteCreation.balances.every((balance) => Number(balance.balance) === 0);

	const onConfirm = async () => {
		if (loading) return;
		if (!isLoggedIn) {
			connectWallet();
			return;
		}
		if (!isRoomJoined) {
			joinRoom();
			return;
		}
		try {
			if (isAllZero) return;
			dispatch(proposalActions.setLoading(true));
			const vote: TVotePayload = {
				balances: voteCreation.balances,
				house_id: proposal.house_id,
				options: voteCreation.options,
				proposal_id: proposal.id,
				room_id: proposal.room_id
			};
			if (voteCreation.note) {
				vote.note = voteCreation.note;
			}

			const { address, data: voteData, signature } = await signApiData<TVotePayload>(vote, user?.address || '');
			const { data, error } = await api.post<IVoteResponse, IVoteBody>('auth/actions/vote', {
				signature: signature,
				vote: voteData,
				voter_address: address
			});
			if (error) {
				dispatch(proposalActions.setError(getErrorMessage(error)));
				dispatch(notificationActions.send({
					message: getErrorMessage(error),
					status: ENotificationStatus.ERROR,
					title: 'Failed!'
				}));
			} else if (!data || !data.createdVote) {
				const error = 'Something went wrong, unable to vote.';
				dispatch(proposalActions.setError(error));
				dispatch(notificationActions.send({
					message: error,
					status: ENotificationStatus.ERROR,
					title: 'Failed!'
				}));
			} else {
				const { createdVote, votes_result } = data;
				dispatch(proposalActions.setVote(createdVote));
				dispatch(proposalActions.setProposal({
					...proposal,
					votes_result
				}));
				dispatch(notificationActions.send({
					message: 'Voted successfully.',
					status: ENotificationStatus.SUCCESS,
					title: 'Success!'
				}));
				dispatch(modalActions.setModal({
					contentType: EContentType.NONE,
					footerType: EFooterType.NONE,
					open: false,
					titleType: ETitleType.NONE
				}));
				dispatch(proposalActions.resetVoteCreation());
			}
			dispatch(proposalActions.setLoading(false));
		} catch (error) {
			dispatch(proposalActions.setLoading(false));
			dispatch(proposalActions.setError(getErrorMessage(error)));
		}
	};

	return (
		<>
			<Divider className='bg-blue_primary' />
			<footer
				className='flex items-center justify-end flex-1 w-full gap-3'
			>
				<button
					disabled={loading}
					className={
						classNames('bg-transparent text-white border border-solid border-blue_primary rounded-lg py-1 px-5 font-medium text-sm', {
							'cursor-not-allowed': loading,
							'cursor-pointer': !loading
						})
					}
					onClick={() => {
						if (loading) return;
						dispatch(modalActions.setModal({
							contentType: EContentType.NONE,
							footerType: EFooterType.NONE,
							open: false,
							titleType: ETitleType.NONE
						}));
						dispatch(proposalActions.setLoading(false));
					}}
				>
                    Cancel
				</button>
				<button
					disabled={isAllZero || loading}
					className={
						classNames('text-white border border-solid border-blue_primary rounded-lg py-1 px-5 font-medium text-sm bg-blue_primary', {
							'cursor-not-allowed': isAllZero || loading,
							'cursor-pointer': !isAllZero && !loading
						})
					}
					onClick={onConfirm}
				>
                    Confirm
				</button>
			</footer>
		</>
	);
};

export default CastYourVoteModalFooter;