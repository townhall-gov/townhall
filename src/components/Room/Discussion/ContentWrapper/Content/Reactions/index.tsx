// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Reaction from '../../../../../../ui-components/Reaction';
import Divider from '~src/components/Room/Proposals/Divider';
import { EPostType, EReaction } from '~src/types/enums';
import { IReactionResponse, IReactionBody } from 'pages/api/auth/actions/reaction';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { discussionActions } from '~src/redux/discussion';
import { useUserReaction, useReactions } from '~src/redux/discussion/selectors';
import { useDiscussionSelector, useProfileSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import getErrorMessage from '~src/utils/getErrorMessage';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';

const Reactions = () => {
	const dispatch = useDispatch();
	const { loading, discussion } = useDiscussionSelector();
	const { user } = useProfileSelector();
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();
	const userReaction = useUserReaction(user?.address || '');
	const likeReactions = useReactions(EReaction.LIKE);
	const dislikeReactions = useReactions(EReaction.DISLIKE);

	const onReaction = async (type: EReaction) => {
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
			if (discussion) {
				dispatch(discussionActions.setLoading(true));
				const { data, error } = await api.post<IReactionResponse, IReactionBody>('auth/actions/reaction', {
					house_id: discussion.house_id,
					post_id: discussion.id,
					post_type: EPostType.DISCUSSION,
					room_id: discussion.room_id,
					type
				});
				if (error) {
					dispatch(discussionActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data) {
					const error = 'Something went wrong, unable to give a reaction to discussion.';
					dispatch(discussionActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					let message = '';
					if (data.isDeleted) {
						message = 'Successfully removed your reaction!';
					} else {
						message = 'Successfully added your reaction!';
					}
					dispatch(discussionActions.setReaction(data));
					dispatch(notificationActions.send({
						message: message,
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
				}
			} else {
				dispatch(notificationActions.send({
					message: 'Something went wrong!',
					status: ENotificationStatus.ERROR,
					title: 'Failed!'
				}));
			}
			dispatch(discussionActions.setLoading(false));
		} catch (error) {
			dispatch(discussionActions.setLoading(false));
			dispatch(notificationActions.send({
				message: getErrorMessage(error),
				status: ENotificationStatus.ERROR,
				title: 'Failed!'
			}));
			dispatch(discussionActions.setError(getErrorMessage(error)));
		}

	};
	return (
		<div className='flex items-center gap-x-[15px]'>
			<Reaction
				userReaction={userReaction}
				loading={loading}
				count={likeReactions?.length || 0}
				onReaction={onReaction}
				type={EReaction.LIKE}
			/>
			<Divider className='text-blue_primary' />
			<Reaction
				userReaction={userReaction}
				loading={loading}
				count={dislikeReactions?.length || 0}
				onReaction={onReaction}
				type={EReaction.DISLIKE}
			/>
		</div>
	);
};

export default Reactions;