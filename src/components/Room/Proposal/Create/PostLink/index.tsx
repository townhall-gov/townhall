// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { postLinkCreationValidation } from '~src/redux/proposal/validation';
import { roomActions } from '~src/redux/room';
import { useProposalCreation } from '~src/redux/room/selectors';
import { addError, removeError } from '~src/redux/rooms/validation';
import { useRoomSelector } from '~src/redux/selectors';
import { SearchIcon } from '~src/ui-components/CustomIcons';
import { getPostLinkFromURL } from '../../Sidebar/PostLink/Modal/Footer';
import api from '~src/services/api';
import { IPostLinkData, IPostLinkDataQuery } from 'pages/api/auth/data/post-link-data';
import getErrorMessage from '~src/utils/getErrorMessage';

const PostLink = () => {
	const proposalCreation = useProposalCreation();
	const { postLink, postLinkData, url } = proposalCreation;
	const dispatch = useDispatch();
	const { loading } = useRoomSelector();
	return (
		<article>
			<h4 className='text-white font-medium text-xl'>Link Discussion Post</h4>
			<article className='flex items-center gap-x-[13px] bg-transparent border border-solid border-blue_primary rounded-xl py-[11px] px-[15px]'>
				<SearchIcon className='text-transparent bg-transparent text-lg' />
				<input
					disabled={loading}
					value={url}
					onChange={(e) => {
						removeError('post_link_url');
						dispatch(roomActions.setProposalCreation_Field({
							key: 'url',
							value: e.target.value
						}));
						if (postLink) {
							dispatch(roomActions.setProposalCreation_Field({
								key: 'postLink',
								value: null
							}));
						}
						if (postLinkData) {
							dispatch(roomActions.setProposalCreation_Field({
								key: 'postLinkData',
								value: null
							}));
						}
					}}
					type='text'
					className={
						classNames('flex w-full border-none outline-none bg-transparent placeholder:text-grey_primary text-sm text-white leading-[21px] font-normal', {
							'cursor-auto': !loading,
							'cursor-not-allowed': loading
						})
					}
					placeholder='Search for URL, post ID'
				/>
			</article>
			<p id='post_link_url' className='m-0 mt-2 text-red_primary font-normal text-xs leading-[15px] hidden'></p>
			<button
				disabled={loading}
				className={
					classNames('bg-blue_primary border border-solid border-blue_primary px-[22px] h-8 rounded-xl font-medium text-sm leading-[17px] tracking-[0.01em] text-white mt-3', {
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
							dispatch(roomActions.setProposalCreation_Field({
								key: 'postLink',
								value: postLink
							}));
							(async () => {
								dispatch(roomActions.setLoading(true));
								try {
									const { data, error } = await api.get<IPostLinkData, IPostLinkDataQuery>('auth/data/post-link-data', {
										...postLink
									});
									if (data) {
										dispatch(roomActions.setProposalCreation_Field({
											key: 'postLinkData',
											value: data
										}));
										dispatch(roomActions.setProposalCreation_Field({
											key: 'title',
											value: data.title
										}));
										dispatch(roomActions.setProposalCreation_Field({
											key: 'description',
											value: data.description
										}));
										dispatch(roomActions.setProposalCreation_Field({
											key: 'tags',
											value: data.tags
										}));
									} else {
										addError('post_link_url', getErrorMessage(error) || 'Something went wrong, unable to fetch post data of given url.');
									}
								} catch (error) {
									console.log(error);
								}
								dispatch(roomActions.setLoading(false));
							})();
						}
					}
				}}
			>
                Link
			</button>
		</article>
	);
};

export default PostLink;