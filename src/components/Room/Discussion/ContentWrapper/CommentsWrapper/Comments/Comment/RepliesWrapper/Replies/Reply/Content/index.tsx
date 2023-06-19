// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useRef, useState } from 'react';
import ReactHTMLParser from 'react-html-parser';
import { useProfileSelector, useDiscussionSelector } from '~src/redux/selectors';
import { IReply } from '~src/types/schema';
import ReplyEditor from '../../../ReplyEditor';
import { useDispatch } from 'react-redux';
import { discussionActions } from '~src/redux/discussion';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import api from '~src/services/api';
import { EAction, EPostType } from '~src/types/enums';
import getErrorMessage from '~src/utils/getErrorMessage';
import { IReplyBody, IReplyResponse } from 'pages/api/auth/actions/reply';

interface IReplyContentProps {
    reply: IReply;
}

const ReplyContent: FC<IReplyContentProps> = (props) => {
	const { reply } = props;
	const timeout = useRef<NodeJS.Timeout>();
	const { discussion, editableReply } = useDiscussionSelector();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const { user } = useProfileSelector();
	if (!user || !user.address) {
		return null;
	}
	if (!reply) return null;

	const onReply = async () => {
		if (loading) return;
		if (!user || !user.address) {
			dispatch(notificationActions.send({
				message: 'Unable to find the address, Please connect your wallet again to create a discussion.',
				status: ENotificationStatus.ERROR,
				title: 'Failed!'
			}));
			return;
		}
		try {
			if (discussion && editableReply) {
				setLoading(true);
				const { data, error } = await api.post<IReplyResponse, IReplyBody>('auth/actions/reply', {
					action_type: EAction.EDIT,
					comment_id:reply.comment_id,
					house_id: discussion.house_id,
					post_id: reply.post_id,
					post_type: EPostType.DISCUSSION,
					reply: editableReply,
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
					const error = 'Something went wrong, unable to edit comment.';
					dispatch(discussionActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					dispatch(discussionActions.updateReplies({
						action_type: EAction.EDIT,
						reply: data.reply
					}));
					dispatch(notificationActions.send({
						message: 'Reply edited successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(discussionActions.resetEditableReply());
				}
				setLoading(false);
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
	const key = `house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}_comment_${reply.comment_id}_reply_${reply.id}`;
	return (
		<section>
			{
				editableReply?.id !== reply?.id?
					<div className='html-content text-white font-normal text-sm leading-[23px] tracking-[0.01em]'>
						{ReactHTMLParser(reply.content)}
					</div>
					:<ReplyEditor
						imageNamePrefix={key}
						localStorageKey={key}
						loading={loading}
						onChange={(v) => {
							clearTimeout(timeout.current);
							timeout.current = setTimeout(() => {
								dispatch(discussionActions.setEditableReply({
									...editableReply,
									content: v
								}));
								clearTimeout(timeout.current);
							}, 0);
						}}
						onReply={onReply}
						onCancel={() => {
							dispatch(discussionActions.resetEditableComment());
							localStorage.removeItem(key);
						}}
						value=''
						initialValue={editableReply?.content || ''}
					/>
			}
		</section>
	);
};

export default ReplyContent;