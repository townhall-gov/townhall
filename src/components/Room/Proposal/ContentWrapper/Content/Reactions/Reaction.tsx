// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import classNames from 'classnames';
import { IReactionBody, IReactionResponse } from 'pages/api/auth/actions/reaction';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { proposalActions } from '~src/redux/proposal';
import { useReactions, useUserReaction } from '~src/redux/proposal/selectors';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { EReaction } from '~src/types/enums';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IReactionProps {
    type: EReaction;
}

const Reaction: FC<IReactionProps> = (props) => {
	const { type } = props;
	const dispatch = useDispatch();
	const { loading } = useProposalSelector();
	const { user } = useProfileSelector();
	const userReaction = useUserReaction(user?.address || '');
	const { proposal } = useProposalSelector();
	const reactions = useReactions(type);

	const onReaction = async (type: EReaction) => {
		if (loading) return;
		if (!user || !user.address) {
			dispatch(modalActions.setModal({
				contentType: EContentType.CONNECT_WALLET,
				footerType: EFooterType.NONE,
				open: true,
				titleType: ETitleType.CONNECT_WALLET
			}));
			dispatch(notificationActions.send({
				message: 'Unable to find the address, Please connect your wallet again to create a proposal.',
				status: ENotificationStatus.ERROR,
				title: 'Failed!'
			}));
			return;
		}

		try {
			dispatch(proposalActions.setLoading(true));
			if (proposal) {
				const { data, error } = await api.post<IReactionResponse, IReactionBody>('auth/actions/reaction', {
					house_id: proposal.house_id,
					proposal_id: proposal.id,
					room_id: proposal.room_id,
					type
				});
				if (error) {
					dispatch(proposalActions.setError(getErrorMessage(error)));
					dispatch(notificationActions.send({
						message: getErrorMessage(error),
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else if (!data) {
					const error = 'Something went wrong, unable to give a reaction to proposal.';
					dispatch(proposalActions.setError(error));
					dispatch(notificationActions.send({
						message: error,
						status: ENotificationStatus.ERROR,
						title: 'Failed!'
					}));
				} else {
					let message = '';
					if (data.isDeleted) {
						message = 'Successfully removed your reaction!';
					} else {
						message = 'Successfully added your reaction!';
					}
					dispatch(proposalActions.setReaction(data));
					dispatch(notificationActions.send({
						message: message,
						status: ENotificationStatus.SUCCESS,
						title: 'Success!'
					}));
				}
			} else {
				dispatch(notificationActions.send({
					message: 'Something went wrong!',
					status: ENotificationStatus.ERROR,
					title: 'Failed!'
				}));
			}
			dispatch(proposalActions.setLoading(false));
		} catch (error) {
			dispatch(proposalActions.setLoading(false));
			dispatch(notificationActions.send({
				message: getErrorMessage(error),
				status: ENotificationStatus.ERROR,
				title: 'Failed!'
			}));
			dispatch(proposalActions.setError(getErrorMessage(error)));
		}

	};
	return (
		<button
			disabled={loading}
			onClick={() => onReaction(type)}
			className={classNames('border-none outline-none flex items-center justify-center gap-x-[6px] bg-transparent text-blue_primary', {
				'cursor-not-allowed': loading,
				'cursor-pointer': !loading
			})}
		>
			{
				type === EReaction.LIKE?
					(userReaction === type? <LikeFilled />:<LikeOutlined />):
					(userReaction === type? <DislikeFilled /> :<DislikeOutlined />)
			}
			<span>
				{reactions.length}
			</span>
		</button>
	);
};

export default Reaction;