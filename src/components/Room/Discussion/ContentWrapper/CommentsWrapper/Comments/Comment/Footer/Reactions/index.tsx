// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ICommentReactionResponse, ICommentReactionBody } from 'pages/api/auth/actions/commentReaction';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { discussionActions } from '~src/redux/discussion';
import { useCommentReactions, useCommentUserReaction } from '~src/redux/discussion/selectors';
import { useProfileSelector, useDiscussionSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { EReaction } from '~src/types/enums';
import { IComment } from '~src/types/schema';
import Reaction from '~src/ui-components/Reaction';
import getErrorMessage from '~src/utils/getErrorMessage';

interface ICommentReactionsProps {
	comment: IComment;
}

const CommentReactions: FC<ICommentReactionsProps> = (props) => {
	const { comment } = props;
	const { reactions } = comment;
	const dispatch = useDispatch();
	const { loading, discussion } = useDiscussionSelector();
	const { user } = useProfileSelector();
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();
	const userReaction = useCommentUserReaction(reactions, user?.address || '');
	const likeReactions = useCommentReactions(reactions, EReaction.LIKE);
	const dislikeReactions = useCommentReactions(reactions, EReaction.DISLIKE);

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
				const { data, error } = await api.post<ICommentReactionResponse, ICommentReactionBody>('auth/actions/commentReaction', {
					comment_id: comment.id,
					house_id: comment.house_id,
					post_id: comment.post_id,
					post_type: comment.post_type,
					room_id: comment.room_id,
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
					dispatch(discussionActions.setCommentReaction({
						...data,
						comment_id: comment.id
					}));
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
				className='text-xs font-normal leading-[22px]'
				count={likeReactions?.length || 0}
				loading={loading}
				onReaction={onReaction}
				type={EReaction.LIKE}
				userReaction={userReaction}
			/>
			<Reaction
				className='text-xs font-normal leading-[22px]'
				count={dislikeReactions?.length || 0}
				loading={loading}
				onReaction={onReaction}
				type={EReaction.DISLIKE}
				userReaction={userReaction}
			/>
		</div>
	);
};

export default CommentReactions;