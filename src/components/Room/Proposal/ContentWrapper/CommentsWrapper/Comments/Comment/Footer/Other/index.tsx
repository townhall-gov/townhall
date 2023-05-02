// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { ICommentResponse, ICommentBody } from 'pages/api/auth/actions/comment';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { proposalActions } from '~src/redux/proposal';
import { useProposalSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { EAction } from '~src/types/enums';
import { IComment } from '~src/types/schema';
import getErrorMessage from '~src/utils/getErrorMessage';
import useCommentOtherActionItems from './utils';

interface ICommentOtherActionsDropdownProps {
    comment: IComment;
}

const CommentOtherActionsDropdown: FC<ICommentOtherActionsDropdownProps> = (props) => {
	const { comment } = props;
	const router = useRouter();
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();
	const { loading, proposal } = useProposalSelector();
	const dispatch = useDispatch();
	const items = useCommentOtherActionItems(comment?.user_address);

	if (!comment || !proposal) return null;
	const { id: comment_id } = comment;

	const onDelete = async () => {
		if (loading) return;
		try {
			dispatch(proposalActions.setLoading(true));
			const { data, error } = await api.post<ICommentResponse, ICommentBody>('auth/actions/comment', {
				action_type: EAction.DELETE,
				comment: comment,
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
				const error = 'Something went wrong, unable to delete a comment.';
				dispatch(proposalActions.setError(error));
				dispatch(notificationActions.send({
					message: error,
					status: ENotificationStatus.ERROR,
					title: 'Failed!'
				}));
			} else {
				dispatch(proposalActions.updateComments({
					action_type: EAction.DELETE,
					comment: data.comment
				}));
				dispatch(notificationActions.send({
					message: 'Comment deleted successfully.',
					status: ENotificationStatus.SUCCESS,
					title: 'Success!'
				}));
			}
			dispatch(proposalActions.setLoading(false));
		} catch (error) {
			dispatch(notificationActions.send({
				message: getErrorMessage(error),
				status: ENotificationStatus.ERROR,
				title: 'Failed!'
			}));
			dispatch(proposalActions.setLoading(false));
		}
	};

	const handleEndpointChange: MenuProps['onClick'] = ({ key }) => {
		if (['delete', 'edit'].includes(key)) {
			if (loading) return;
			if (!isLoggedIn) {
				connectWallet();
				return;
			}
			if (!isRoomJoined) {
				joinRoom();
				return;
			}
		}
		switch(key) {
		case 'copy-link': {
			const origin = window.location.origin;
			const query = router.query;
			const url = `${origin}/house/${query.house_id}/room/${query.room_id}/proposal/${query.proposal_id}#${comment_id}`;
			navigator.clipboard.writeText(url);
		}
			break;
		case 'delete': {
			onDelete();
		}
			break;
		case 'edit': {
			dispatch(proposalActions.setEditableComment(comment));
		}
		}
	};

	return (
		<div>
			<Dropdown
				trigger={['click']}
				disabled={loading}
				menu={{ items, onClick: handleEndpointChange }}
			>
				<button
					disabled={loading}
					className={classNames('outline-none border-none flex items-center justify-center text-blue_primary text-lg leading-none w-[22px] h-[22px] rounded-full bg-transparent hover:bg-[#2E3035]', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})}
				>
					<MoreOutlined className='rotate-90' />
				</button>
			</Dropdown>
		</div>
	);
};

export default CommentOtherActionsDropdown;