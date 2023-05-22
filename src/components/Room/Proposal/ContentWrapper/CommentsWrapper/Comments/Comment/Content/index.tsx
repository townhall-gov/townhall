// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useRef } from 'react';
import ReactHTMLParser from 'react-html-parser';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import { IComment } from '~src/types/schema';
import CommentEditor from '../../../CommentEditor';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { ICommentResponse, ICommentBody } from 'pages/api/auth/actions/comment';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import api from '~src/services/api';
import { EAction } from '~src/types/enums';
import getErrorMessage from '~src/utils/getErrorMessage';

interface ICommentContentProps {
    comment: IComment;
}

const CommentContent: FC<ICommentContentProps> = (props) => {
	const { comment } = props;
	const timeout = useRef<NodeJS.Timeout>();
	const { proposal, editableComment, loading } = useProposalSelector();
	const dispatch = useDispatch();

	const { user } = useProfileSelector();
	if (!user || !user.address) {
		return null;
	}
	if (!comment) return null;

	const onSentiment = async () => {
		dispatch(modalActions.setModal({
			contentType: EContentType.COMMENT_SENTIMENT,
			footerType: EFooterType.COMMENT_SENTIMENT,
			open: true,
			titleType: ETitleType.NONE
		}));
	};

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
			if (proposal && editableComment) {
				dispatch(proposalActions.setLoading(true));
				const { data, error } = await api.post<ICommentResponse, ICommentBody>('auth/actions/comment', {
					action_type: EAction.EDIT,
					comment: editableComment,
					house_id: proposal.house_id,
					proposal_id: proposal.id,
					room_id: proposal.room_id
				});
				if (error) {
					dispatch(proposalActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data || !data.comment) {
					const error = 'Something went wrong, unable to edit comment.';
					dispatch(proposalActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					dispatch(proposalActions.updateComments({
						action_type: EAction.EDIT,
						comment: data.comment
					}));
					dispatch(notificationActions.send({
						message: 'Comment edited successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(proposalActions.resetEditableComment());
				}
				dispatch(proposalActions.setLoading(false));
			} else {
				dispatch(notificationActions.send({
					message: 'Something went wrong!',
					status: ENotificationStatus.ERROR,
					title: 'Failed!'
				}));
			}
		} catch (error) {
			dispatch(proposalActions.setLoading(false));
			dispatch(proposalActions.setError(getErrorMessage(error)));
		}
	};
	return (
		<section>
			{
				editableComment?.id !== comment?.id?
					<div className='html-content text-white font-normal text-sm leading-[23px] tracking-[0.01em]'>
						{ReactHTMLParser(comment.content)}
					</div>
					:<CommentEditor
						imageNamePrefix={`house_${proposal?.house_id}_room_${proposal?.room_id}_proposal_${proposal?.id}_comment_${comment?.id}`}
						localStorageKey='commentEditor'
						disabled={loading}
						onChange={(v) => {
							clearTimeout(timeout.current);
							timeout.current = setTimeout(() => {
								dispatch(proposalActions.setEditableComment({
									...editableComment,
									content: v
								}));
								clearTimeout(timeout.current);
							}, 1000);
						}}
						onSentiment={onSentiment}
						onComment={onComment}
						onCancel={() => {
							dispatch(proposalActions.resetEditableComment());
							localStorage.removeItem('commentEditor');
						}}
						value=''
						initialValue={editableComment?.content || ''}
					/>
			}
		</section>
	);
};

export default CommentContent;