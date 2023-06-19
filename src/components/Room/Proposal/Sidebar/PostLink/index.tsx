// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { usePostLink } from '~src/redux/proposal/selectors';
import { useProfileSelector, useProposalSelector } from '~src/redux/selectors';
import { FolderLinksIcon, PostLinkIcon } from '~src/ui-components/CustomIcons';

const PostLink = () => {
	const postLink = usePostLink();
	const dispatch = useDispatch();
	const { user } = useProfileSelector();
	const { proposal } = useProposalSelector();
	if (postLink || !user || (user.address !== proposal?.proposer_address)) {
		return null;
	}
	return (
		<article className='flex flex-col gap-y-6 items-center justify-center border border-solid border-blue_primary rounded-2xl p-6'>
			<PostLinkIcon className='text-[213px]' />
			<button
				onClick={() => {
					dispatch(modalActions.setModal({
						contentType: EContentType.POST_LINK_MODAL,
						footerType: EFooterType.POST_LINK_MODAL,
						open: true,
						titleType: ETitleType.POST_LINK_MODAL
					}));
				}}
				className='cursor-pointer outline-none flex items-center bg-blue_primary rounded-2xl border border-solid border-blue_primary px-[22px] py-[11px] gap-x-2'
			>
				<FolderLinksIcon className='text-xl text-transparent stroke-white' />
				<span className='text-base font-normal leading-[19px] tracking-[0.01em] text-white'>Link Discussion Post</span>
			</button>
		</article>
	);
};

export default PostLink;