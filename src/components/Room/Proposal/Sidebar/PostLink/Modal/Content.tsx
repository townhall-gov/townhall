// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import ReactHTMLParser from 'react-html-parser';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { EPostLinkCreationAction } from '~src/redux/proposal/@types';
import { usePostLinkCreation } from '~src/redux/proposal/selectors';
import { removeError } from '~src/redux/rooms/validation';
import { useProposalSelector } from '~src/redux/selectors';
import { HexWarningIcon, SearchIcon } from '~src/ui-components/CustomIcons';
import TextEditor from '~src/ui-components/TextEditor';
import CustomTags from '~src/ui-components/Tags';

const PostLinkModalContent = () => {
	const { action } = usePostLinkCreation();
	return (
		<section className='my-6'>
			{
				action === EPostLinkCreationAction.FETCHING_POST_LINK_DATA?
					<FetchingPostLinkData />
					: action === EPostLinkCreationAction.AUTO_FILLING_POST_LINK_DATA?
						<AutoFillingPostLinkData />
						: <PreviewingPostLinkData />
			}
			<div className='h-[0.5px] my-6 w-full bg-blue_primary'></div>
		</section>
	);
};

const FetchingPostLinkData = () => {
	const { url, action, postLink, postLinkData } = usePostLinkCreation();
	const { loading } = useProposalSelector();
	const dispatch = useDispatch();
	return (
		<>
			<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px]'>Link Discussion Post</h4>
			<article className='flex items-center gap-x-[13px] bg-transparent border border-solid border-blue_primary rounded-xl py-[11px] px-[15px]'>
				<SearchIcon className='text-transparent bg-transparent text-lg' />
				<input
					disabled={loading}
					value={url}
					onChange={(e) => {
						removeError('post_link_url');
						dispatch(proposalActions.setPostLinkCreation_Field({
							key: 'url',
							value: e.target.value
						}));
						if (action !== EPostLinkCreationAction.FETCHING_POST_LINK_DATA) {
							dispatch(proposalActions.setPostLinkCreation_Field({
								key: 'action',
								value: EPostLinkCreationAction.FETCHING_POST_LINK_DATA
							}));
						}
						if (postLink) {
							dispatch(proposalActions.setPostLinkCreation_Field({
								key: 'postLink',
								value: null
							}));
						}
						if (postLinkData) {
							dispatch(proposalActions.setPostLinkCreation_Field({
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
			<p className='m-0 mt-6 flex items-center bg-blue_primary rounded-2xl p-4 gap-x-2'>
				<HexWarningIcon className='text-transparent stroke-white text-[26px]' />
				<span className='text-sm leading-[21px] font-normal tracking-[0.005em]'>The data will be auto filled from discussion post.</span>
			</p>
		</>
	);
};

const AutoFillingPostLinkData = () => {
	const { url, postLinkData, postLink } = usePostLinkCreation();
	const { loading } = useProposalSelector();
	const dispatch = useDispatch();
	const timeout = useRef<NodeJS.Timeout>();

	if (!postLinkData) return null;

	const updateTags = (tag: string, isDelete?: boolean) => {
		const { tags } = postLinkData;
		let newTags: string[] = (tags && Array.isArray(tags))? [...tags]: [];
		if (isDelete) {
			newTags = newTags.filter((item) => item !== tag);
		} else if (tags.includes(tag)) {
			return;
		} else {
			newTags.push(tag);
		}
		dispatch(proposalActions.setPostLinkCreation_Field({
			key: 'postLinkData',
			value: {
				...postLinkData,
				tags: newTags
			}
		}));
	};

	const key = `house_${postLink?.house_id}_room_${postLink?.room_id}_post_${postLink?.post_type}_postid_${postLink?.post_id}`;

	return (
		<>
			<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Link Discussion Post</h4>
			<p className='m-0 flex items-center gap-x-[13px] bg-transparent border border-solid border-blue_primary rounded-xl py-[11px] px-[15px] text-grey_primary'>
				{url}
			</p>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Title</h4>
				<input
					disabled={loading}
					value={postLinkData.title}
					onChange={(e) => {
						removeError('post_link_url');
						dispatch(proposalActions.setPostLinkCreation_Field({
							key: 'postLinkData',
							value: {
								...postLinkData,
								title: e.target.value
							}
						}));
					}}
					type='text'
					className={
						classNames('flex items-center gap-x-[13px] bg-transparent border border-solid border-blue_primary rounded-xl py-[11px] px-[15px] w-full outline-none placeholder:text-grey_primary text-sm text-white leading-[21px] font-normal', {
							'cursor-auto': !loading,
							'cursor-not-allowed': loading
						})
					}
					placeholder='Search for URL, post ID'
				/>
			</article>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Description</h4>
				<TextEditor
					imageNamePrefix={key}
					initialValue={postLinkData.description}
					isDisabled={loading}
					height={225}
					value=''
					localStorageKey={key}
					onChange={(v) => {
						clearTimeout(timeout.current);
						timeout.current = setTimeout(() => {
							dispatch(proposalActions.setPostLinkCreation_Field({
								key: 'postLinkData',
								value: {
									...postLinkData,
									description: v
								}
							}));
							clearTimeout(timeout.current);
						}, 0);
					}}
				/>
			</article>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Tags</h4>
				<CustomTags
					tags={postLinkData?.tags}
					className={'min-h-min rounded-xl pt-2 pb-2 pl-3 pr-3'}
					addTag={(tag) => {
						updateTags(tag);
					}}
					deleteTag={(tag) => {
						updateTags(tag, true);
					}}
					canDelete
					canAdd={(postLinkData?.tags? postLinkData.tags?.length < 5: true)}
					isDisabled={loading}
				/>
			</article>
		</>
	);
};

const PreviewingPostLinkData = () => {
	const { url, postLinkData } = usePostLinkCreation();
	// const dispatch = useDispatch();

	if (!postLinkData) return null;
	return (
		<>
			<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Link Discussion Post</h4>
			<p className='m-0 flex items-center gap-x-[13px] bg-transparent border border-solid border-blue_primary rounded-xl py-[11px] px-[15px] text-grey_primary'>
				{url}
			</p>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Title</h4>
				<p
					className={
						classNames('flex items-center gap-x-[13px] border border-solid border-blue_primary rounded-xl py-[11px] px-[15px] w-full text-sm text-grey_primary leading-[21px] font-normal')
					}
				>
					{postLinkData?.title}
				</p>
			</article>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Description</h4>
				<div className='html-content text-grey_primary font-normal text-sm leading-[23px] tracking-[0.01em] border border-solid border-blue_primary rounded-xl py-[11px] px-[15px] w-full '>
					{ReactHTMLParser(postLinkData?.description || '')}
				</div>
			</article>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Tags</h4>
				<CustomTags
					tags={postLinkData?.tags}
					className={'min-h-min rounded-xl pt-2 pb-2 pl-3 pr-3'}
					addTag={() => {}}
					deleteTag={() => {}}
					canDelete={false}
					canAdd={false}
					isDisabled={true}
				/>
			</article>
		</>
	);
};

export default PostLinkModalContent;