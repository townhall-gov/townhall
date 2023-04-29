// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useRef } from 'react';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import Address from '~src/ui-components/Address';
import TextEditor from '~src/ui-components/TextEditor';
import CommentedUserImage from './CommentedUserImage';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { useCommentCreation } from '~src/redux/proposal/selectors';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import getErrorMessage from '~src/utils/getErrorMessage';
import api from '~src/services/api';
import { ICommentBody, ICommentResponse } from 'pages/api/auth/actions/comment';
import { EAction } from '~src/types/enums';

const CreateComment = () => {
	const commentCreation = useCommentCreation();
	const dispatch = useDispatch();
	const timeout = useRef<NodeJS.Timeout>();
	const { loading, proposal } = useProposalSelector();

	const { user } = useProfileSelector();
	if (!user || !user.address) {
		return null;
	}

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
			if (proposal) {
				dispatch(proposalActions.setLoading(true));
				const { data, error } = await api.post<ICommentResponse, ICommentBody>('auth/action/comment', {
					action_type: EAction.ADD,
					comment: {
						// TODO: we are sending redundant data, will improve this later
						content: commentCreation.content,
						created_at: new Date(),
						deleted_at: null,
						history: [],
						id: '',
						is_deleted: false,
						proposal_id: proposal.id,
						reactions: [],
						sentiment: commentCreation.sentiment,
						updated_at: new Date(),
						user_address: user.address
					},
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
					const error = 'Something went wrong, unable to comment.';
					dispatch(proposalActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					dispatch(proposalActions.updateComments({
						action_type: EAction.ADD,
						comment: data.comment
					}));
					dispatch(notificationActions.send({
						message: 'Commented successfully.',
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
					dispatch(proposalActions.resetCommentCreation());
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
		<section className='flex gap-x-[10px]'>
			<div className='w-10'>
				<CommentedUserImage />
			</div>
			<div className='flex-1 flex flex-col gap-y-[13px]'>
				<p className='flex items-center gap-x-2 m-0 text-base text-white font-medium leading-[20px] tracking-[0.01em]'>
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
				</p>
				<TextEditor
					initialValue={''}
					isDisabled={loading}
					height={225}
					value={commentCreation?.content}
					localStorageKey='commentCreation'
					onChange={(v) => {
						clearTimeout(timeout.current);
						timeout.current = setTimeout(() => {
							dispatch(proposalActions.setCommentCreation_Field({
								key: 'content',
								value: v
							}));
							clearTimeout(timeout.current);
						}, 1000);
					} }
				/>
				<div className='flex items-center justify-end'>
					<button
						onClick={onComment}
						className='border border-solid border-blue_primary text-blue_primary py-1 px-6 rounded-md text-base font-medium bg-transparent flex items-center justify-center cursor-pointer'
					>
						Comment
					</button>
				</div>
			</div>
		</section>
	);
};

export default CreateComment;