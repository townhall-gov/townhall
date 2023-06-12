// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useRef, useState } from 'react';
import { useDiscussionSelector, useProfileSelector } from '~src/redux/selectors';
import Address from '~src/ui-components/Address';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import getErrorMessage from '~src/utils/getErrorMessage';
import api from '~src/services/api';
import { ICommentBody, ICommentResponse } from 'pages/api/auth/actions/comment';
import { EAction, EPostType } from '~src/types/enums';
import CommentedUserImage from '~src/ui-components/CommentedUserImage';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import CommentEditor from '../CommentEditor';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import ConnectWalletBanner from './ConnectWalletBanner';
import { editorActions } from '~src/redux/editor';
import { discussionActions } from '~src/redux/discussion';
import { useCommentCreation } from '~src/redux/discussion/selectors';

const CreateComment = () => {
	const commentCreation = useCommentCreation();
	const dispatch = useDispatch();
	const timeout = useRef<NodeJS.Timeout>();
	const { discussion } = useDiscussionSelector();
	const [loading, setLoading] = useState(false);
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();

	useEffect(() => {
		if(commentCreation.comment_open) {
			onComment();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[commentCreation]);

	const { user } = useProfileSelector();
	if (!user || !user.address) {
		return <ConnectWalletBanner connectWallet={connectWallet} />;
	}

	const onSentiment = async () => {
		if (loading) return;
		if (!isLoggedIn) {
			connectWallet();
			return;
		}
		if (!isRoomJoined) {
			joinRoom();
			return;
		}
		dispatch(modalActions.setModal({
			contentType: EContentType.DISCUSSION_COMMENT_SENTIMENT,
			footerType: EFooterType.DISCUSSION_COMMENT_SENTIMENT,
			open: true,
			titleType: ETitleType.NONE
		}));
	};

	const onComment = async () => {
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
				const { data, error } = await api.post<ICommentResponse, ICommentBody>('auth/actions/comment', {
					action_type: EAction.ADD,
					comment: {
						// TODO: we are sending redundant data, will improve this later
						content: commentCreation.content,
						created_at: new Date(),
						deleted_at: null,
						history: [],
						id: '',
						is_deleted: false,
						post_id: discussion.id,
						reactions: [],
						replies: [],
						sentiment: commentCreation.sentiment,
						updated_at: new Date(),
						user_address: user.address
					},
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
					const error = 'Something went wrong, unable to comment.';
					dispatch(discussionActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					dispatch(discussionActions.updateComments({
						action_type: EAction.ADD,
						comment: data.comment
					}));
					dispatch(notificationActions.send({
						message: 'Commented successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(discussionActions.resetCommentCreation());
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
	const key = `house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}_comment`;
	return (
		<section className='flex gap-x-[10px] p-2 min-h-[321px]'>
			<div className='w-10'>
				<CommentedUserImage />
			</div>
			<div className='flex-1 flex flex-col gap-y-[13px]'>
				<div className='flex items-center gap-x-2 m-0 text-base text-white font-medium leading-[20px] tracking-[0.01em]'>
					<span>By</span>
					{
						user.username?
							<span>{user.username}</span>
							: (
								<Address
									identiconSize={20}
									ethIdenticonSize={20}
									address={user.address}
								/>
							)
					}
				</div>
				<CommentEditor
					imageNamePrefix={key}
					localStorageKey={key}
					onComment={onSentiment}
					onCancel={() => {
						dispatch(discussionActions.setCommentCreation_Field({
							key: 'content',
							value: ''
						}));
						localStorage.removeItem(key);
						dispatch(editorActions.setIsClean(true));
					}}
					loading={loading}
					onChange={(v) => {
						clearTimeout(timeout.current);
						timeout.current = setTimeout(() => {
							dispatch(discussionActions.setCommentCreation_Field({
								key: 'content',
								value: v
							}));
							clearTimeout(timeout.current);
						}, 1000);
					}}
					initialValue=''
					value={commentCreation?.content}
				/>
			</div>
		</section>
	);
};

export default CreateComment;