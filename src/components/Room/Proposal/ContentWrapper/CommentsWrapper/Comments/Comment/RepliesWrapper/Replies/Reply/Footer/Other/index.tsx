// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { useAuthActionsCheck } from '~src/redux/profile/selectors';
import { proposalActions } from '~src/redux/proposal';
import { useProposalSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { EAction } from '~src/types/enums';
import { IReply } from '~src/types/schema';
import getErrorMessage from '~src/utils/getErrorMessage';
import useReplyOtherActionItems from './utils';
import { IReplyBody, IReplyResponse } from 'pages/api/auth/actions/reply';

interface IReplyOtherActionsDropdownProps {
    reply: IReply;
}

const ReplyOtherActionsDropdown: FC<IReplyOtherActionsDropdownProps> = (props) => {
	const { reply } = props;
	const router = useRouter();
	const { isLoggedIn, isRoomJoined, connectWallet, joinRoom } = useAuthActionsCheck();
	const { loading, proposal } = useProposalSelector();
	const dispatch = useDispatch();
	const items = useReplyOtherActionItems(reply?.user_address);

	if (!reply || !proposal) return null;

	const onDelete = async () => {
		if (loading) return;
		try {
			dispatch(proposalActions.setLoading(true));
			const { data, error } = await api.post<IReplyResponse, IReplyBody>('auth/actions/reply', {
				action_type: EAction.DELETE,
				comment_id: reply.comment_id,
				house_id: reply.house_id,
				post_id: reply.post_id,
				post_type: reply.post_type,
				reply: reply,
				room_id: reply.room_id
			});
			if (error) {
				dispatch(proposalActions.setError(getErrorMessage(error)));
				dispatch(notificationActions.send({
					message: getErrorMessage(error),
					status: ENotificationStatus.ERROR,
					title: 'Failed!'
				}));
			} else if (!data || !data.reply) {
				const error = 'Something went wrong, unable to delete a reply.';
				dispatch(proposalActions.setError(error));
				dispatch(notificationActions.send({
					message: error,
					status: ENotificationStatus.ERROR,
					title: 'Failed!'
				}));
			} else {
				dispatch(proposalActions.updateReplies({
					action_type: EAction.DELETE,
					reply: data.reply
				}));
				dispatch(notificationActions.send({
					message: 'Reply deleted successfully.',
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
			const url = `${origin}/${query.house_id}/${query.room_id}/proposal/${query.proposal_id}#${reply.comment_id}`;
			navigator.clipboard.writeText(url);
		}
			break;
		case 'delete': {
			onDelete();
		}
			break;
		case 'edit': {
			dispatch(proposalActions.setEditableReply(reply));
		}
		}
	};

	return (
		<div>
			<Dropdown
				trigger={['click']}
				disabled={loading}
				menu={{ items, onClick: handleEndpointChange }}
				overlayClassName='ant-dropdown-menu-border-blue_primary '
				overlayStyle={{ marginLeft:'5rem' , marginTop:'-2.5rem' }}
				placement={'bottomLeft'}
			>
				<button
					disabled={loading}
					className={classNames('outline-none border-none flex items-center justify-center text-blue_primary text-lg leading-none w-[22px] h-[22px] rounded-full bg-transparent ', {
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

export default ReplyOtherActionsDropdown;