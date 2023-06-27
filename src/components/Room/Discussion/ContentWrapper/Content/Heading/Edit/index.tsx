// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useDispatch } from 'react-redux';
import { discussionActions } from '~src/redux/discussion';
import { EEditableDiscussionAction } from '~src/redux/discussion/@types';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { useDiscussionSelector } from '~src/redux/selectors';
import { PenToolAddIcon } from '~src/ui-components/CustomIcons';

const Edit = () => {
	const dispatch = useDispatch();
	const { discussion } = useDiscussionSelector();
	if (!discussion) return null;
	return (
		<button
			onClick={() => {
				dispatch(discussionActions.setEditableDiscussion({
					action: EEditableDiscussionAction.EDIT_DISCUSSION,
					description: discussion?.description,
					tags: discussion?.tags,
					title: discussion?.title
				}));
				dispatch(modalActions.setModal({
					contentType: EContentType.DISCUSSION_EDIT_MODAL,
					footerType: EFooterType.DISCUSSION_EDIT_MODAL,
					open: true,
					titleType: ETitleType.DISCUSSION_EDIT_MODAL
				}));
			}}
			className='outline-none border-none bg-transparent flex items-center justify-center gap-x-1 text-grey_tertiary font-medium text-base leading-[20px] tracking-[0.01em] cursor-pointer'
		>
			<PenToolAddIcon className='text-xl text-transparent stroke-grey_tertiary' />
			<span>Edit</span>
		</button>
	);
};

export default Edit;