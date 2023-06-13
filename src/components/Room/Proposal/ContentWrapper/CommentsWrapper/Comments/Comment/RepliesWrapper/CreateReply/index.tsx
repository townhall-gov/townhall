// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC, useRef, useState } from 'react';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import Address from '~src/ui-components/Address';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { useReplyCreation } from '~src/redux/proposal/selectors';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import getErrorMessage from '~src/utils/getErrorMessage';
import api from '~src/services/api';
import { EAction } from '~src/types/enums';
import CommentedUserImage from '~src/components/Room/Proposal/ContentWrapper/CommentsWrapper/Comments/Comment/CommentedUserImage';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import ReplyEditor from '../ReplyEditor';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import ConnectWalletBanner from './ConnetWalletBanner';
import { editorActions } from '~src/redux/editor';
import { IReplyBody, IReplyResponse } from 'pages/api/auth/actions/reply';
import { IReply } from '~src/types/schema';

interface ICreateProps {
	comment_id: string,
	replies: IReply[]|null;
}

const CreateReply :FC<ICreateProps>= (props) => {
	const { comment_id } = props;
	const replyCreation = useReplyCreation();
	const dispatch = useDispatch();
	const timeout = useRef<NodeJS.Timeout>();
	const { proposal  } = useProposalSelector();
	const [loading, setLoading] = useState(false);
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();
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
			contentType: EContentType.COMMENT_SENTIMENT,
			footerType: EFooterType.COMMENT_SENTIMENT,
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
			if (proposal) {
				setLoading(true);
				const { data, error } = await api.post<IReplyResponse, IReplyBody>('auth/actions/reply', {
					action_type: EAction.ADD,
					comment_id:comment_id,
					house_id: proposal.house_id,
					proposal_id: proposal.id,
					reply: {
						// TODO: we are sending redundant data, will improve this later
						comment_id:comment_id,
						content: replyCreation.content,
						created_at: new Date(),
						deleted_at: null,
						history: [],
						id: '',
						is_deleted: false,
						proposal_id: proposal.id,
						reactions: [],
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
					dispatch(proposalActions.setIsRepliesVisible({ replies_comment_id:comment_id,replies_isVisible:true }));
					dispatch(proposalActions.setIsReplyBoxVisible({ replybox_comment_id:comment_id,replybox_isVisible:false }));
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

	const key = `house_${proposal?.house_id}_room_${proposal?.room_id}_proposal_${proposal?.id}_comment_${comment_id}_reply`;
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
				<ReplyEditor
					imageNamePrefix={key}
					localStorageKey={key}
					onSentiment={onSentiment}
					onComment={onComment}
					onCancel={() => {
						dispatch(proposalActions.setReplyCreation_Field({
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
							dispatch(proposalActions.setReplyCreation_Field({
								key: 'content',
								value: v
							}));
							clearTimeout(timeout.current);
						}, 1000);
					}}
					initialValue=''
					value={replyCreation?.content}
				/>
			</div>
		</section>
	);
};

export default CreateReply;