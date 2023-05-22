// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { ICreateProposalBody, ICreateProposalResponse, TProposalPayload } from 'pages/api/auth/actions/createProposal';
import React from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { roomActions } from '~src/redux/room';
import { IListingProposal } from '~src/redux/room/@types';
import { useProposalCreation } from '~src/redux/room/selectors';
import proposalCreationValidation, { removeErrorFieldHighlight } from '~src/redux/room/validation';
import { useRoomSelector } from '~src/redux/selectors';
import { useProfileSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import getErrorMessage from '~src/utils/getErrorMessage';
import { signApiData } from '~src/utils/sign';

const PreviewBtn = () => {
	const dispatch = useDispatch();
	const { loading } = useRoomSelector();
	const { user } = useProfileSelector();
	const proposalCreation = useProposalCreation();
	const { connectWallet, isLoggedIn, isRoomJoined, joinRoom } = useAuthActionsCheck();
	const router = useRouter();

	const onPublish = async () => {
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
			dispatch(roomActions.setLoading(true));
			removeErrorFieldHighlight('proposal_error', 'border-blue_primary');
			const errors = proposalCreationValidation.validate(proposalCreation, true);
			if (errors && Array.isArray(errors) && errors.length > 0) {
				const errorMap: any = {};
				errors.forEach((error) => {
					if (error) {
						if (typeof error.error === 'string' && !errorMap[error.error]) {
							errorMap[error.error] = true;
							dispatch(notificationActions.send({
								message: error.error,
								status: ENotificationStatus.ERROR,
								title: 'Validation Error!'
							}));
						} else if (Array.isArray(error.error)) {
							error.error.forEach((err) => {
								if (typeof err.error === 'string' && !errorMap[err.error] ) {
									errorMap[err.error] = true;
									dispatch(notificationActions.send({
										message: err.error,
										status: ENotificationStatus.ERROR,
										title: 'Validation Error!'
									}));
								}
							});
						}
					}
				});
				if (Object.keys(errorMap).length > 0) {
					dispatch(roomActions.setLoading(false));
					return;
				}
			}
			const { description, end_date, is_vote_results_hide_before_voting_ends, start_date, tags, title, discussion, voting_system, voting_system_options } = proposalCreation;
			const { query } = router;
			if (start_date && end_date && voting_system && voting_system_options && query.house_id && query.room_id) {
				const proposal: TProposalPayload = {
					description,
					discussion: discussion,
					end_date: end_date,
					house_id: String(query.house_id),
					is_vote_results_hide_before_voting_ends: is_vote_results_hide_before_voting_ends,
					room_id: String(query.room_id),
					start_date: start_date,
					tags: tags,
					title: title,
					voting_system: voting_system,
					voting_system_options: voting_system_options
				};
				const { address, data: proposalData, signature } = await signApiData<TProposalPayload>(proposal, user?.address || '');
				const { data, error } = await api.post<ICreateProposalResponse, ICreateProposalBody>('auth/actions/createProposal', {
					proposal: proposalData,
					proposer_address: address,
					signature: signature
				});
				if (error) {
					dispatch(roomActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data || !data.createdProposal) {
					const error = 'Something went wrong, unable to create a proposal.';
					dispatch(roomActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					const { createdProposal } = data;
					const proposal: IListingProposal = {
						comments_count: 0,
						created_at: createdProposal.created_at,
						house_id: createdProposal.house_id,
						id: createdProposal.id,
						proposer_address: createdProposal.proposer_address,
						reactions_count: {
							'👍🏻': 0,
							'👎🏻': 0
						},
						room_id: createdProposal.room_id,
						tags: createdProposal.tags,
						title: createdProposal.title
					};
					dispatch(roomActions.setProposal(proposal));
					dispatch(notificationActions.send({
						message: 'Proposal created successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(roomActions.resetProposalCreation());
					router.push(`/house/${query.house_id}/room/${query.room_id}/proposal/${data.createdProposal.id}`);
				}
			}
			dispatch(roomActions.setLoading(false));
		} catch (error) {
			dispatch(roomActions.setLoading(false));
			dispatch(roomActions.setError(getErrorMessage(error)));
		}
	};
	return (
		<div className='mb-10'>
			<button
				disabled={loading}
				onClick={onPublish}
				className={
					classNames('outline-none border border-solid border-[#66A5FF] flex items-center justify-center bg-blue_primary rounded-2xl text-white py-[11px] px-[22px] max-w-[188px] w-full text-base leading-[19px] font-normal tracking-[0.01em]', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})
				}
			>
                Publish
			</button>
		</div>
	);
};

export default PreviewBtn;