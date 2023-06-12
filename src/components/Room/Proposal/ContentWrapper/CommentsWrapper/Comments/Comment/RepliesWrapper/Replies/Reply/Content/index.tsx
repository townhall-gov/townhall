// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useRef, useState } from 'react';
import ReactHTMLParser from 'react-html-parser';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import { IReply } from '~src/types/schema';
import ReplyEditor from '../../../ReplyEditor';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import api from '~src/services/api';
import { EAction } from '~src/types/enums';
import getErrorMessage from '~src/utils/getErrorMessage';
import { IReplyBody, IReplyResponse } from 'pages/api/auth/actions/reply';

interface IReplyContentProps {
    reply: IReply;
}

const ReplyContent: FC<IReplyContentProps> = (props) => {
	const { reply } = props;
	const timeout = useRef<NodeJS.Timeout>();
	const { proposal, editableReply } = useProposalSelector();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const { user } = useProfileSelector();
	if (!user || !user.address) {
		return null;
	}
	if (!reply) return null;

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
			if (proposal && editableReply) {
				setLoading(true);
				const { data, error } = await api.post<IReplyResponse, IReplyBody>('auth/actions/reply', {
					action_type: EAction.EDIT,
					comment_id:reply.comment_id,
					house_id: proposal.house_id,
					proposal_id: reply.proposal_id,
					reply: editableReply,
					room_id: proposal.room_id
				});
				if (error) {
					dispatch(proposalActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data || !data.reply) {
					const error = 'Something went wrong, unable to edit comment.';
					dispatch(proposalActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					dispatch(proposalActions.updateReplies({
						action_type: EAction.EDIT,
						reply: data.reply
					}));
					dispatch(notificationActions.send({
						message: 'Comment edited successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(proposalActions.resetEditableReply());
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
			dispatch(proposalActions.setError(getErrorMessage(error)));
		}
	};
	const key = `house_${proposal?.house_id}_room_${proposal?.room_id}_proposal_${proposal?.id}_comment_${reply.comment_id}_reply_${reply.id}`;
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
								dispatch(proposalActions.setEditableReply({
									...editableReply,
									content: v
								}));
								clearTimeout(timeout.current);
							}, 1000);
						}}
						onSentiment={onSentiment}
						onComment={onComment}
						onCancel={() => {
							dispatch(proposalActions.resetEditableComment());
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