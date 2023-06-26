// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button } from 'antd';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { ICreateProposalBody, ICreateProposalResponse, TProposalPayload } from 'pages/api/auth/actions/createProposal';
import { ICurrentBalanceResponse, ICurrentBalanceBody } from 'pages/api/chain/data/currentBalance';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM } from '~src/global/min_token';
import { useSelectedHouse } from '~src/redux/houses/selectors';
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
import { formatToken } from '~src/utils/formatTokenAmount';
import getErrorMessage from '~src/utils/getErrorMessage';
import { signApiData } from '~src/utils/sign';

const PreviewBtn = () => {
	const dispatch = useDispatch();
	const { loading, room } = useRoomSelector();
	const { user } = useProfileSelector();
	const selectedHouse = useSelectedHouse(room?.house_id || '');
	const proposalCreation = useProposalCreation();
	const { connectWallet, isLoggedIn, isRoomJoined, joinRoom } = useAuthActionsCheck();
	const router = useRouter();
	const [canCreateProposal, setCanCreateProposal] = React.useState(false);
	useEffect(() => {
		(async () => {
			setCanCreateProposal(false);
			if (user?.address && selectedHouse && selectedHouse.blockchain && room) {
				try {
					const { data, error } = await api.post<ICurrentBalanceResponse, ICurrentBalanceBody>('chain/data/currentBalance', {
						address: user?.address,
						contract: room?.contract_address,
						network: selectedHouse.blockchain
					});
					if (error) {
						dispatch(notificationActions.send({
							message: getErrorMessage(error),
							status: ENotificationStatus.ERROR,
							title: 'Error!'
						}));
					} else if (!data || (data.balance === undefined || data.balance === null || data.balance === '') || !data.decimals || !data.symbol) {
						dispatch(notificationActions.send({
							message: 'This token is not supported.',
							status: ENotificationStatus.ERROR,
							title: 'Error!'
						}));
					} else {
						const token = formatToken(data?.balance || 0, true, Number(data?.decimals || 0));
						if (token && Number(token) >= Number(room.min_token_to_create_proposal_in_room || MIN_TOKEN_TO_CREATE_PROPOSAL_IN_ROOM)) {
							setCanCreateProposal(true);
						}
					}
				} catch (error) {
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Error!'
					}));
				}
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.address, room?.contract_address, selectedHouse?.blockchain]);

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
		if (!canCreateProposal) {
			dispatch(notificationActions.send({
				message: 'You can\'t create a proposal with less than 10 tokens.',
				status: ENotificationStatus.ERROR,
				title: 'Error!'
			}));
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
			const { description, end_date, is_vote_results_hide_before_voting_ends, start_date, tags, title, discussion, voting_system, voting_system_options, postLink, postLinkData } = proposalCreation;
			const { query } = router;
			if (start_date && end_date && voting_system && voting_system_options && query.house_id && query.room_id) {
				const proposal: TProposalPayload = {
					description,
					discussion: discussion,
					end_date: end_date,
					house_id: String(query.house_id),
					is_vote_results_hide_before_voting_ends: is_vote_results_hide_before_voting_ends,
					post_link: postLink,
					post_link_data: postLinkData,
					room_id: String(query.room_id),
					start_date: start_date,
					tags: tags,
					title: title,
					voting_system: voting_system,
					voting_system_options: voting_system_options.filter((option) => option.value.trim())
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
						end_date: createdProposal.end_date,
						house_id: createdProposal.house_id,
						id: createdProposal.id,
						proposer_address: createdProposal.proposer_address,
						reactions_count: {
							'👍🏻': 0,
							'👎🏻': 0
						},
						room_id: createdProposal.room_id,
						start_date: createdProposal.start_date,
						status: createdProposal.status,
						tags: createdProposal.tags,
						title: createdProposal.title,
						votes_result: createdProposal.votes_result
					};
					dispatch(roomActions.setProposal(proposal));
					dispatch(notificationActions.send({
						message: 'Proposal created successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(roomActions.resetProposalCreation());
					router.push(`/${query.house_id}/${query.room_id}/proposal/${data.createdProposal.id}`);
				}
			}
			dispatch(roomActions.setLoading(false));
		} catch (error) {
			dispatch(roomActions.setLoading(false));
			const err = getErrorMessage(error);
			dispatch(roomActions.setError(err));
			dispatch(notificationActions.send({
				message: err,
				status: ENotificationStatus.ERROR,
				title: 'Error!'
			}));
		}
	};
	return (
		<div className='mb-10'>
			<Button
				loading={loading}
				onClick={onPublish}
				className={
					classNames('outline-none border h-full border-solid border-[#66A5FF] flex items-center justify-center bg-blue_primary rounded-2xl text-white py-[11px] px-[22px] max-w-[188px] w-full text-base leading-[19px] font-normal tracking-[0.01em]', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})
				}
			>
                Publish
			</Button>
		</div>
	);
};

export default PreviewBtn;
