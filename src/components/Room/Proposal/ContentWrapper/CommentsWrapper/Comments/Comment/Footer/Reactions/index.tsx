// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ICommentReactionResponse, ICommentReactionBody } from 'pages/api/auth/actions/commentReaction';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { proposalActions } from '~src/redux/proposal';
import { useCommentReactions, useCommentUserReaction } from '~src/redux/proposal/selectors';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { EReaction } from '~src/types/enums';
import { IReaction } from '~src/types/schema';
import Reaction from '~src/ui-components/Reaction';
import getErrorMessage from '~src/utils/getErrorMessage';

interface ICommentReactionsProps {
	reactions: IReaction[];
	comment_id: string;
}

const CommentReactions: FC<ICommentReactionsProps> = (props) => {
	const { reactions, comment_id } = props;
	const dispatch = useDispatch();
	const { loading, proposal } = useProposalSelector();
	const { user } = useProfileSelector();
	const userReaction = useCommentUserReaction(reactions, user?.address || '');
	const likeReactions = useCommentReactions(reactions, EReaction.LIKE);
	const dislikeReactions = useCommentReactions(reactions, EReaction.DISLIKE);

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
			if (proposal) {
				dispatch(proposalActions.setLoading(true));
				const { data, error } = await api.post<ICommentReactionResponse, ICommentReactionBody>('auth/actions/commentReaction', {
					comment_id: comment_id,
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
					dispatch(proposalActions.setCommentReaction({
						...data,
						comment_id: comment_id
					}));
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
		<div className='flex items-center gap-x-[15px]'>
			<Reaction
				className='text-xs font-normal leading-[22px]'
				count={likeReactions?.length || 0}
				loading={loading}
				onReaction={onReaction}
				type={EReaction.LIKE}
				userReaction={userReaction}
			/>
			<Reaction
				className='text-xs font-normal leading-[22px]'
				count={dislikeReactions?.length || 0}
				loading={loading}
				onReaction={onReaction}
				type={EReaction.DISLIKE}
				userReaction={userReaction}
			/>
		</div>
	);
};

export default CommentReactions;