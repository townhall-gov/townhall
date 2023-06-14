// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button } from 'antd';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { ICreateDiscussionBody, ICreateDiscussionResponse, TDiscussionPayload } from 'pages/api/auth/actions/createDiscussion';
import React from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { roomActions } from '~src/redux/room';
import { IListingDiscussion } from '~src/redux/room/@types';
import { useDiscussionCreation } from '~src/redux/room/selectors';
import { useRoomSelector } from '~src/redux/selectors';
import { useProfileSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import getErrorMessage from '~src/utils/getErrorMessage';

const PreviewBtn = () => {
	const dispatch = useDispatch();
	const { loading } = useRoomSelector();
	const { user } = useProfileSelector();
	const discussionCreation = useDiscussionCreation();
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
			const { description, tags, title } = discussionCreation;
			const { query } = router;
			if (query.house_id && query.room_id && user?.address) {
				const discussion: TDiscussionPayload = {
					description,
					house_id: String(query.house_id),
					post_link: null,
					room_id: String(query.room_id),
					tags: tags,
					title: title
				};
				const { data, error } = await api.post<ICreateDiscussionResponse, ICreateDiscussionBody>('auth/actions/createDiscussion', {
					discussion: discussion,
					proposer_address: user?.address
				});
				if (error) {
					dispatch(roomActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data || !data.createdDiscussion) {
					const error = 'Something went wrong, unable to create a discussion.';
					dispatch(roomActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					const { createdDiscussion } = data;
					const discussion: IListingDiscussion = {
						comments_count: 0,
						created_at: createdDiscussion.created_at,
						house_id: createdDiscussion.house_id,
						id: createdDiscussion.id,
						post_link: createdDiscussion.post_link,
						proposer_address: createdDiscussion.proposer_address,
						reactions_count: {
							'👍🏻': 0,
							'👎🏻': 0
						},
						room_id: createdDiscussion.room_id,
						tags: createdDiscussion.tags,
						title: createdDiscussion.title
					};
					dispatch(roomActions.setDiscussion(discussion));
					dispatch(notificationActions.send({
						message: 'Discussion created successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(roomActions.resetProposalCreation());
					router.push(`/${query.house_id}/${query.room_id}/discussion/${data.createdDiscussion.id}`);
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
                Save & Preview
			</Button>
		</div>
	);
};

export default PreviewBtn;