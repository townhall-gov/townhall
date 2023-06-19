// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC, useRef, useState } from 'react';
import { useProfileSelector, useDiscussionSelector } from '~src/redux/selectors';
import { useDispatch } from 'react-redux';
import { discussionActions } from '~src/redux/discussion';
import { useReplyCreation } from '~src/redux/discussion/selectors';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import getErrorMessage from '~src/utils/getErrorMessage';
import api from '~src/services/api';
import { EAction, EPostType } from '~src/types/enums';
import ReplyEditor from '../ReplyEditor';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';

import { editorActions } from '~src/redux/editor';
import { IReplyBody, IReplyResponse } from 'pages/api/auth/actions/reply';

interface ICreateProps {
	comment_id: string;
}

const CreateReply: FC<ICreateProps> = (props) => {
	const { comment_id } = props;
	const replyCreation = useReplyCreation();
	const dispatch = useDispatch();
	const timeout = useRef<NodeJS.Timeout>();
	const { discussion } = useDiscussionSelector();
	const [loading, setLoading] = useState(false);
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();

	const { user } = useProfileSelector();
	if (!user || !user.address) {
		return null;
	}

	const onReply = async () => {
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
				setLoading(true);
				const { data, error } = await api.post<IReplyResponse, IReplyBody>('auth/actions/reply', {
					action_type: EAction.ADD,
					comment_id: comment_id,
					house_id: discussion.house_id,
					post_id: discussion.id,
					post_type: EPostType.DISCUSSION,
					reply: {
						// TODO: we are sending redundant data, will improve this later
						comment_id: comment_id,
						content: replyCreation.content,
						created_at: new Date(),
						deleted_at: null,
						history: [],
						id: '',
						is_deleted: false,
						post_id: discussion.id,
						reactions: [],
						sentiment: replyCreation.sentiment,
						updated_at: new Date(),
						user_address: user.address
					},
					room_id: discussion.room_id
				});
				if (error) {
					dispatch(discussionActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data || !data.reply) {
					const error = 'Something went wrong, unable to reply.';
					dispatch(discussionActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					dispatch(discussionActions.updateReplies({
						action_type: EAction.ADD,
						reply: data.reply
					}));
					dispatch(notificationActions.send({
						message: 'Replied successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(discussionActions.resetReplyCreation());
					dispatch(discussionActions.setIsReplyBoxVisible({ replyBox_comment_id: '',replyBox_isVisible:false }));
				}
				setLoading(false);
				dispatch(editorActions.setIsClean(true));
			} else {
				dispatch(notificationActions.send({
					message: 'Something went wrong!',
					status: ENotificationStatus.ERROR,
					title: 'Failed!'
				}));
			}
		} catch (error) {
			setLoading(false);
			dispatch(discussionActions.setError(getErrorMessage(error)));
		}
	};

	const key = `house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}_comment_${comment_id}_reply`;
	return (
		<article className='flex gap-x-[10px] pb-3'>
			<ReplyEditor
				imageNamePrefix={key}
				localStorageKey={key}
				onReply={onReply}
				onCancel={() => {
					dispatch(discussionActions.setReplyCreation_Field({
						key: 'content',
						value: ''
					}));
					localStorage.removeItem(key);
					dispatch(
						discussionActions.setIsReplyBoxVisible({
							replyBox_comment_id: '',
							replyBox_isVisible: false
						})
					);
					dispatch(editorActions.setIsClean(true));
				}}
				loading={loading}
				onChange={(v) => {
					clearTimeout(timeout.current);
					timeout.current = setTimeout(() => {
						dispatch(discussionActions.setReplyCreation_Field({
							key: 'content',
							value: v
						}));
						clearTimeout(timeout.current);
					}, 0);
				}}
				initialValue=''
				value={replyCreation?.content}
			/>
		</article>
	);
};

export default CreateReply;