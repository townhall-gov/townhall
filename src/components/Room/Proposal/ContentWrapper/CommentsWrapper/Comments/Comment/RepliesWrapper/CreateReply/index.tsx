// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC, useRef, useState } from 'react';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { useReplyCreation } from '~src/redux/proposal/selectors';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import getErrorMessage from '~src/utils/getErrorMessage';
import api from '~src/services/api';
import { EAction } from '~src/types/enums';
import ReplyEditor from '../ReplyEditor';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';

import { editorActions } from '~src/redux/editor';
import { IReplyBody, IReplyResponse } from 'pages/api/auth/actions/reply';
import { IComment } from '~src/types/schema';

interface ICreateProps {
	comment: IComment;
}

const CreateReply: FC<ICreateProps> = (props) => {
	const { comment } = props;
	const replyCreation = useReplyCreation();
	const dispatch = useDispatch();
	const timeout = useRef<NodeJS.Timeout>();
	const { proposal } = useProposalSelector();
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
			if (proposal) {
				setLoading(true);
				const { data, error } = await api.post<IReplyResponse, IReplyBody>('auth/actions/reply', {
					action_type: EAction.ADD,
					comment_id: comment.id,
					house_id: comment.house_id,
					post_id: comment.post_id,
					post_type: comment.post_type,
					reply: {
						// TODO: we are sending redundant data, will improve this later
						comment_id: comment.id,
						content: replyCreation.content,
						created_at: new Date(),
						deleted_at: null,
						history: [],
						house_id: comment.house_id,
						id: '',
						is_deleted: false,
						post_id: proposal.id,
						post_type: comment.post_type,
						reactions: [],
						room_id: comment.room_id,
						sentiment: replyCreation.sentiment,
						updated_at: new Date(),
						user_address: user.address
					},
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
					const error = 'Something went wrong, unable to reply.';
					dispatch(proposalActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					dispatch(proposalActions.updateReplies({
						action_type: EAction.ADD,
						reply: data.reply
					}));
					dispatch(notificationActions.send({
						message: 'Replied successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(proposalActions.resetReplyCreation());
					dispatch(proposalActions.setReplyComment(null));
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
			dispatch(proposalActions.setError(getErrorMessage(error)));
		}
	};

	const key = `house_${proposal?.house_id}_room_${proposal?.room_id}_proposal_${proposal?.id}_comment_${comment.id}_reply`;
	return (
		<article className='flex gap-x-[10px] pb-3'>
			<ReplyEditor
				imageNamePrefix={key}
				localStorageKey={key}
				onReply={onReply}
				onCancel={() => {
					dispatch(proposalActions.setReplyCreation_Field({
						key: 'content',
						value: ''
					}));
					localStorage.removeItem(key);
					dispatch(
						proposalActions.setReplyComment(null)
					);
					dispatch(editorActions.setIsClean(true));
				}}
				loading={loading}
				onChange={(v) => {
					clearTimeout(timeout.current);
					timeout.current = setTimeout(() => {
						dispatch(proposalActions.setReplyCreation_Field({
							key: 'content',
							value: v
						}));
						clearTimeout(timeout.current);
					}, 100);
				}}
				initialValue=''
				value={replyCreation?.content}
			/>
		</article>
	);
};

export default CreateReply;