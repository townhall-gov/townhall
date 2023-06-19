// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useRef, useState } from 'react';
import ReactHTMLParser from 'react-html-parser';
import { useDiscussionSelector, useProfileSelector } from '~src/redux/selectors';
import { IComment } from '~src/types/schema';
import CommentEditor from '../../../CommentEditor';
import { useDispatch } from 'react-redux';
import { discussionActions } from '~src/redux/discussion';
import { ICommentResponse, ICommentBody } from 'pages/api/auth/actions/comment';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import api from '~src/services/api';
import { EAction, EPostType } from '~src/types/enums';
import getErrorMessage from '~src/utils/getErrorMessage';

interface ICommentContentProps {
    comment: IComment;
}

const CommentContent: FC<ICommentContentProps> = (props) => {
	const { comment } = props;
	const timeout = useRef<NodeJS.Timeout>();
	const { discussion, editableComment } = useDiscussionSelector();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const { user } = useProfileSelector();

	if (!comment) return null;

	const onComment = async () => {
		if (loading) return;
		if (!user || !user.address) {
			dispatch(notificationActions.send({
				message: 'Unable to find the address, Please connect your wallet again to create a proposal.',
				status: ENotificationStatus.ERROR,
				title: 'Failed!'
			}));
			return;
		}
		try {
			if (discussion && editableComment) {
				setLoading(true);
				const { data, error } = await api.post<ICommentResponse, ICommentBody>('auth/actions/comment', {
					action_type: EAction.EDIT,
					comment: editableComment,
					house_id: discussion.house_id,
					post_id: discussion.id,
					post_type: EPostType.DISCUSSION,
					room_id: discussion.room_id
				});
				if (error) {
					dispatch(discussionActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data || !data.comment) {
					const error = 'Something went wrong, unable to edit comment.';
					dispatch(discussionActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					dispatch(discussionActions.updateComments({
						action_type: EAction.EDIT,
						comment: data.comment
					}));
					dispatch(notificationActions.send({
						message: 'Comment edited successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(discussionActions.resetEditableComment());
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
	const key = `house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}_comment_${comment?.id}`;
	return (
		<section>
			{
				editableComment?.id !== comment?.id?
					<div className='html-content text-white font-normal text-sm leading-[23px] tracking-[0.01em]'>
						{ReactHTMLParser(comment.content)}
					</div>
					:<CommentEditor
						imageNamePrefix={key}
						localStorageKey={key}
						loading={loading}
						onChange={(v) => {
							clearTimeout(timeout.current);
							timeout.current = setTimeout(() => {
								dispatch(discussionActions.setEditableComment({
									...editableComment,
									content: v
								}));
								clearTimeout(timeout.current);
							}, 0);
						}}
						onComment={onComment}
						onCancel={() => {
							dispatch(discussionActions.resetEditableComment());
							localStorage.removeItem(key);
						}}
						value=''
						initialValue={editableComment?.content || ''}
					/>
			}
		</section>
	);
};

export default CommentContent;