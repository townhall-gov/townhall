// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import { IPostLinkBody, IPostLinkResponse } from 'pages/api/auth/actions/postLink';
import { IPostLinkData, IPostLinkDataQuery } from 'pages/api/auth/data/post-link-data';
import React from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { notificationActions } from '~src/redux/notification';
import { ENotificationStatus } from '~src/redux/notification/@types';
import { proposalActions } from '~src/redux/proposal';
import { EPostLinkCreationAction } from '~src/redux/proposal/@types';
import { usePostLinkCreation } from '~src/redux/proposal/selectors';
import { postLinkCreationValidation } from '~src/redux/proposal/validation';
import { addError } from '~src/redux/rooms/validation';
import { useProposalSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { EAction, EPostType } from '~src/types/enums';
import { IPostLink } from '~src/types/schema';
import getErrorMessage from '~src/utils/getErrorMessage';

const getPostLinkFromURL = (url: string): IPostLink | null => {
	let postLink: IPostLink | null = null;

	const pattern = /^https:\/\/(?:www\.)?townhallgov\.com\/(\w+)\/(\w+)\/(discussion|proposal)\/(\d+)$/;

	// Test the URL against the pattern and extract the values
	const match = url.match(pattern);

	if (match) {
		const houseId = match[1];
		const roomId = match[2];
		const postType = match[3];
		const postId = Number(match[4]);

		postLink = {
			house_id: houseId,
			post_id: postId,
			post_type: (postType === 'discussion' ? EPostType.DISCUSSION : EPostType.PROPOSAL),
			room_id: roomId
		};
	}
	return postLink;
};

const PostLinkModalFooter = () => {
	const { action } = usePostLinkCreation();
	return (
		<article className='flex items-center justify-end gap-x-2'>
			{
				action === EPostLinkCreationAction.FETCHING_POST_LINK_DATA?
					<FetchingPostLinkData />
					: action === EPostLinkCreationAction.AUTO_FILLING_POST_LINK_DATA?
						<AutoFillingPostLinkData />
						: <PreviewingPostLinkData />
			}
		</article>
	);
};

const FetchingPostLinkData = () => {
	const dispatch = useDispatch();
	const { url } = usePostLinkCreation();
	const { loading } = useProposalSelector();
	return (
		<>
			<button
				disabled={loading}
				onClick={() => {
					dispatch(modalActions.setModal({
						contentType: EContentType.NONE,
						footerType: EFooterType.NONE,
						open: false,
						titleType: ETitleType.NONE
					}));
					dispatch(proposalActions.setPostLinkCreation_Field({
						key: 'url',
						value: ''
					}));
					dispatch(proposalActions.setPostLinkCreation_Field({
						key: 'postLink',
						value: null
					}));
				}}
				className={
					classNames('bg-transparent border border-solid border-blue_primary px-[22px] h-8 rounded-xl font-medium text-sm leading-[17px] tracking-[0.01em]', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})
				}
			>
    Cancel
			</button>
			<button
				disabled={loading}
				className={
					classNames('bg-blue_primary border border-solid border-blue_primary px-[22px] h-8 rounded-xl font-medium text-sm leading-[17px] tracking-[0.01em]', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})
				}
				onClick={() => {
					const error = postLinkCreationValidation.url(url);
					if (error) {
						addError('post_link_url', error);
					} else {
						const postLink = getPostLinkFromURL(url);
						if (!postLink) {
							addError('post_link_url', 'URL is not valid');
						} else {
							dispatch(proposalActions.setPostLinkCreation_Field({
								key: 'postLink',
								value: postLink
							}));
							(async () => {
								dispatch(proposalActions.setLoading(true));
								try {
									const { data, error } = await api.get<IPostLinkData, IPostLinkDataQuery>('auth/data/post-link-data', {
										...postLink
									});
									if (data) {
										dispatch(proposalActions.setPostLinkCreation_Field({
											key: 'postLinkData',
											value: data
										}));
										dispatch(proposalActions.setPostLinkCreation_Field({
											key: 'action',
											value: EPostLinkCreationAction.AUTO_FILLING_POST_LINK_DATA
										}));
									} else {
										dispatch(notificationActions.send({
											message: getErrorMessage(error) || 'Something went wrong, unable to fetch post data of given url.',
											status: ENotificationStatus.ERROR,
											title: 'Error!'
										}));
									}
								} catch (error) {
									console.log(error);
								}
								dispatch(proposalActions.setLoading(false));
							})();
						}
					}
				}}
			>
    Confirm
			</button>
		</>
	);
};

const AutoFillingPostLinkData = () => {
	const dispatch = useDispatch();
	const { loading } = useProposalSelector();
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
					dispatch(proposalActions.setPostLinkCreation_Field({
						key: 'action',
						value: EPostLinkCreationAction.FETCHING_POST_LINK_DATA
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
				onClick={() => {
					dispatch(proposalActions.setPostLinkCreation_Field({
						key: 'action',
						value: EPostLinkCreationAction.PREVIEWING_POST_LINK_DATA
					}));
				}}
			>
                Save & Preview
			</button>
		</>
	);
};

const PreviewingPostLinkData = () => {
	const dispatch = useDispatch();
	const { postLink, postLinkData } = usePostLinkCreation();
	const { loading, proposal } = useProposalSelector();
	const onLink = async () => {
		if (!proposal) {
			return;
		}
		if (!postLink) {
			return;
		}
		if (!postLinkData) {
			return;
		}
		dispatch(proposalActions.setLoading(true));
		const { data, error } = await api.post<IPostLinkResponse, IPostLinkBody>('auth/actions/postLink', {
			action_type: EAction.ADD,
			house_id: proposal?.house_id,
			post_id: proposal?.id,
			post_link: postLink,
			post_link_data: postLinkData,
			post_type: EPostType.PROPOSAL,
			room_id: proposal?.room_id
		});
		if (data && data.updatedPost) {
			dispatch(proposalActions.setProposal({
				...proposal,
				...data.updatedPost
			}));
			dispatch(proposalActions.resetPostLinkCreation_Field());
		} else {
			dispatch(notificationActions.send({
				message: getErrorMessage(error) || 'Something went wrong, unable to link a proposal with discussion.',
				status: ENotificationStatus.ERROR,
				title: 'Error!'
			}));
		}
		dispatch(proposalActions.setLoading(false));
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
					dispatch(proposalActions.setPostLinkCreation_Field({
						key: 'action',
						value: EPostLinkCreationAction.AUTO_FILLING_POST_LINK_DATA
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
				onClick={onLink}
			>
                Link
			</button>
		</>
	);
};

export default PostLinkModalFooter;