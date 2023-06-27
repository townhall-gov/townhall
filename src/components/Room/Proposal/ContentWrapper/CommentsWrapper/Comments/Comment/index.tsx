// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC, useEffect } from 'react';
import { IComment } from '~src/types/schema';
import CommentedUserImage from '~src/ui-components/CommentedUserImage';
import CommentHeader from './Header';
import CommentContent from './Content';
import CommentFooter from './Footer';

import { useRouter } from 'next/router';
import RepliesWrapper from './RepliesWrapper/index';

interface ICommentProps {
	comment: IComment;
}

const Comment: FC<ICommentProps> = (props) => {
	const { comment } = props;
	const { replies } = comment;
	const { asPath } = useRouter();

	useEffect(() => {
		if (typeof window == 'undefined') return;
		if (window.location.hash) {
			const hash = window.location.hash.replace('#', '');
			const commentWrapperElm = document.getElementById(hash);
			const commentContentElm = document.getElementById(`${hash}-content`);
			if (commentWrapperElm && commentContentElm && hash === `${comment.id}`) {
				const timeout = setTimeout(() => {
					window.scrollTo({
						behavior: 'smooth',
						top: commentWrapperElm.offsetTop
					});
				}, 500);
				commentWrapperElm.classList.remove('border-transparent');
				commentWrapperElm.classList.add('border-blue_primary');
				commentContentElm.classList.remove('border-b');
				return () => {
					commentWrapperElm.classList.add('border-transparent');
					commentWrapperElm.classList.remove('border-blue_primary');
					commentContentElm.classList.add('border-b');
					clearTimeout(timeout);
				};
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [asPath, comment.id]);

	if (!comment) return null;
	const { user_address, created_at, updated_at, history, id } = comment;

	return (
		<section id={id} className='flex gap-x-[10px] rounded-md p-2 pb-0  border border-solid border-transparent relative'>
			<article className='w-10'>
				<CommentedUserImage />
			</article>
			<article id={`${id}-content`} className='flex-1 flex flex-col border-0 border-b border-solid border-blue_primary w-full'>
				<section className='flex flex-col gap-y-2'>
					<CommentHeader
						created_at={created_at}
						updated_at={updated_at}
						history={history}
						user_address={user_address}
					/>
					<CommentContent
						comment={comment}
					/>
					<CommentFooter
						comment={comment}
					/>
				</section>
				<RepliesWrapper replies={replies} comment_id={comment.id} />
			</article>
		</section>
	);
};

export default Comment;