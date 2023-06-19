// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { useProposalCreation } from '~src/redux/room/selectors';
import { useRoomSelector } from '~src/redux/selectors';
import CustomTags from '~src/ui-components/Tags';

interface ITagsProps {
    className?: string;
}

const Tags: FC<ITagsProps> = (props) => {
	const { className } = props;
	const proposalCreation = useProposalCreation();
	const tags = proposalCreation?.tags || [] as string[];
	const dispatch = useDispatch();
	const { loading,isPropsalPreviewState } = useRoomSelector();

	const updateTags = (tag: string, isDelete?: boolean) => {
		let newTags = (tags && Array.isArray(tags))? [...tags]: [];
		if (isDelete) {
			newTags = newTags.filter((item) => item !== tag);
		} else if (tags.includes(tag)) {
			return;
		} else {
			newTags.push(tag);
		}
		dispatch(roomActions.setProposalCreation_Field({
			key: 'tags',
			value: newTags
		}));
	};

	return (
		<div className='flex flex-col'>
			<h3 className='text-white font-medium text-xl'>Tags</h3>
			<CustomTags
				tags={tags}
				className={className}
				addTag={(tag) => {
					updateTags(tag);
				}}
				deleteTag={(tag) => {
					updateTags(tag, true);
				}}
				canDelete
				canAdd={tags?.length < 5}
				isDisabled={isPropsalPreviewState||loading}
			/>
		</div>
	);
};

export default Tags;