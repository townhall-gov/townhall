// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import ReactHTMLParser from 'react-html-parser';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { discussionActions } from '~src/redux/discussion';
import { EEditableDiscussionAction } from '~src/redux/discussion/@types';
import { useEditableDiscussion } from '~src/redux/discussion/selectors';
import { useDiscussionSelector } from '~src/redux/selectors';
import TextEditor from '~src/ui-components/TextEditor';
import CustomTags from '~src/ui-components/Tags';

const DiscussionEditModalContent = () => {
	const { action } = useEditableDiscussion();
	return (
		<section className='my-6'>
			{

				action === EEditableDiscussionAction.EDIT_DISCUSSION?
					<EditingDiscussionData />
					: action === EEditableDiscussionAction.PREVIEWING_DISCUSSION?
						<PreviewingEditedDiscussionData />
						: null
			}
		</section>
	);
};

const EditingDiscussionData = () => {
	const editableDiscussion = useEditableDiscussion();
	const { loading, discussion } = useDiscussionSelector();
	const dispatch = useDispatch();
	const timeout = useRef<NodeJS.Timeout>();

	if (!editableDiscussion || !discussion) return null;
	const { tags, title } = editableDiscussion;

	const updateTags = (tag: string, isDelete?: boolean) => {
		let newTags: string[] = (tags && Array.isArray(tags))? [...tags]: [];
		if (isDelete) {
			newTags = newTags.filter((item) => item !== tag);
		} else if (tags.includes(tag)) {
			return;
		} else {
			newTags.push(tag);
		}
		dispatch(discussionActions.setEditableDiscussion_Field({
			key: 'tags',
			value: newTags
		}));
	};

	const key = `house_${discussion?.house_id}_room_${discussion?.room_id}_discussion_${discussion?.id}`;

	return (
		<>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Title</h4>
				<input
					disabled={loading}
					value={title}
					onChange={(e) => {
						dispatch(discussionActions.setEditableDiscussion_Field({
							key: 'title',
							value: e.target.value
						}));
					}}
					type='text'
					className={
						classNames('flex items-center gap-x-[13px] bg-transparent border border-solid border-blue_primary rounded-xl py-[11px] px-[15px] w-full outline-none placeholder:text-grey_primary text-sm text-white leading-[21px] font-normal', {
							'cursor-auto': !loading,
							'cursor-not-allowed': loading
						})
					}
					placeholder='Title'
				/>
			</article>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Description</h4>
				<TextEditor
					imageNamePrefix={key}
					initialValue={discussion.description}
					isDisabled={loading}
					height={225}
					value=''
					localStorageKey={key}
					spinClassName='bg-dark_blue_primary'
					onChange={(v) => {
						clearTimeout(timeout.current);
						timeout.current = setTimeout(() => {
							dispatch(discussionActions.setEditableDiscussion_Field({
								key: 'description',
								value: v
							}));
							clearTimeout(timeout.current);
						}, 0);
					}}
				/>
			</article>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Tags</h4>
				<CustomTags
					tags={tags}
					className={'min-h-min rounded-xl pt-2 pb-2 pl-3 pr-3'}
					addTag={(tag) => {
						updateTags(tag);
					}}
					deleteTag={(tag) => {
						updateTags(tag, true);
					}}
					canDelete
					canAdd={(tags? tags?.length < 5: true)}
					isDisabled={loading}
				/>
			</article>
		</>
	);
};

const PreviewingEditedDiscussionData = () => {
	const editableDescription = useEditableDiscussion();
	// const dispatch = useDispatch();

	if (!editableDescription) return null;

	const { description, tags, title } = editableDescription;

	return (
		<>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Title</h4>
				<p
					className={
						classNames('flex items-center gap-x-[13px] border border-solid border-blue_primary rounded-xl py-[11px] px-[15px] w-full text-sm text-white leading-[21px] font-normal')
					}
				>
					{title}
				</p>
			</article>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Description</h4>
				<div className='html-content text-white font-normal text-sm leading-[23px] tracking-[0.01em] border border-solid border-blue_primary rounded-xl py-[11px] px-[15px] w-full '>
					{ReactHTMLParser(description || '')}
				</div>
			</article>
			<article className='mt-6'>
				<h4 className='m-0 p-0 mb-[2px] font-normal text-sm leading-[21px] tracking-[0.0025em]'>Tags</h4>
				<CustomTags
					tags={tags}
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

export default DiscussionEditModalContent;