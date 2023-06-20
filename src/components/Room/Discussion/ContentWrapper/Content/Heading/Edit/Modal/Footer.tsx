// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import { IEditDiscussionBody, TEditedDiscussion } from 'pages/api/auth/actions/editDiscussionPost';
import React from 'react';
import { useDispatch } from 'react-redux';
import { discussionActions } from '~src/redux/discussion';
import { EEditableDiscussionAction } from '~src/redux/discussion/@types';
import { useEditableDiscussion } from '~src/redux/discussion/selectors';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { useDiscussionSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import getErrorMessage from '~src/utils/getErrorMessage';

const DiscussionEditModalFooter = () => {
	const { action } = useEditableDiscussion();
	return (
		<article className='flex items-center justify-end gap-x-2'>
			{

				action === EEditableDiscussionAction.EDIT_DISCUSSION?
					<EditingDiscussionData />
					: action === EEditableDiscussionAction.PREVIEWING_DISCUSSION?
						<PreviewingEditedDiscussionData />
						: null
			}
		</article>
	);
};

const EditingDiscussionData = () => {
	const dispatch = useDispatch();
	const { loading } = useDiscussionSelector();
	return (
		<>
			<button
				disabled={loading}
				className={
					classNames('bg-blue_primary border border-solid border-blue_primary px-[22px] h-8 rounded-xl font-medium text-sm leading-[17px] tracking-[0.01em]', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})
				}
				onClick={() => {
					dispatch(discussionActions.setEditableDiscussion_Field({
						key: 'action',
						value: EEditableDiscussionAction.PREVIEWING_DISCUSSION
					}));
				}}
			>
                Save & Preview
			</button>
		</>
	);
};

const PreviewingEditedDiscussionData = () => {
	const dispatch = useDispatch();
	const { description, tags, title } = useEditableDiscussion();
	const { loading, discussion } = useDiscussionSelector();

	const onPost = async () => {
		if (!discussion) {
			return;
		}

		dispatch(discussionActions.setLoading(true));
		const { data, error } = await api.post<TEditedDiscussion, IEditDiscussionBody>('auth/actions/editDiscussionPost', {
			description: description,
			discussion_id: discussion?.id,
			house_id: discussion?.house_id,
			room_id: discussion?.room_id,
			tags: tags,
			title: title
		});
		if (data) {
			dispatch(discussionActions.setDiscussion({
				...discussion,
				...data
			}));
			dispatch(discussionActions.resetEditableDiscussion());
			dispatch(modalActions.setModal({
				contentType: EContentType.NONE,
				footerType: EFooterType.NONE,
				open: false,
				titleType: ETitleType.NONE
			}));
		} else {
			dispatch(notificationActions.send({
				message: getErrorMessage(error) || 'Something went wrong, unable to edit the discussion.',
				status: ENotificationStatus.ERROR,
				title: 'Error!'
			}));
		}
		dispatch(discussionActions.setLoading(false));
	};

	return (
		<>
			<button
				disabled={loading}
				className={
					classNames('bg-transparent border border-solid border-blue_primary px-[22px] h-8 rounded-xl font-medium text-sm leading-[17px] tracking-[0.01em]', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})
				}
				onClick={() => {
					dispatch(discussionActions.setEditableDiscussion_Field({
						key: 'action',
						value: EEditableDiscussionAction.EDIT_DISCUSSION
					}));
				}}
			>
                Go back & Edit
			</button>
			<button
				disabled={loading}
				className={
					classNames('bg-blue_primary border border-solid border-blue_primary px-[22px] h-8 rounded-xl font-medium text-sm leading-[17px] tracking-[0.01em]', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})
				}
				onClick={onPost}
			>
                Post
			</button>
		</>
	);
};

export default DiscussionEditModalFooter;