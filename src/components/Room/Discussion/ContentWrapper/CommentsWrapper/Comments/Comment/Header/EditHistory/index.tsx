// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { discussionActions } from '~src/redux/discussion';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { IHistoryComment } from '~src/types/schema';

interface IEditHistoryProps {
    history: IHistoryComment[];
}

const EditHistory: FC<IEditHistoryProps> = (props) => {
	const { history } = props;
	const dispatch = useDispatch();
	return (
		<button
			onClick={() => {
				dispatch(modalActions.setModal({
					contentType: EContentType.DISCUSSION_COMMENT_EDIT_HISTORY,
					footerType: EFooterType.DISCUSSION_COMMENT_EDIT_HISTORY,
					open: true,
					titleType: ETitleType.DISCUSSION_COMMENT_EDIT_HISTORY
				}));
				dispatch(discussionActions.setCommentEditHistory(history));
			}}
			className='text-xs leading-[15px] text-grey_light bg-transparent flex items-center justify-center border-none outline-none cursor-pointer underline underline-offset-[3px]'
		>
            Edit History
		</button>
	);
};

export default EditHistory;