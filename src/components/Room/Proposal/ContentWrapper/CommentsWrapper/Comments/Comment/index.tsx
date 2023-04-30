// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC, useEffect, useRef } from 'react';
import { IComment } from '~src/types/schema';
import CommentedUserImage from './CommentedUserImage';
import CommentHeader from './Header';
import CommentContent from './Content';
import CommentFooter from './Footer';
import RepliesWrapper from './RepliesWrapper';
import { useRouter } from 'next/router';

interface ICommentProps {
	comment: IComment;
}

const Comment: FC<ICommentProps> = (props) => {
	const { comment } = props;
	const commentWrapperRef = useRef<HTMLDivElement>(null!);
	const commentContentRef = useRef<HTMLDivElement>(null!);
	const { asPath } = useRouter();

	useEffect(() => {
		if (typeof window == 'undefined') return;
		if (window.location.hash) {
			const hash = window.location.hash.replace('#', '');
			if (commentWrapperRef && commentWrapperRef.current && hash === `${comment.id}`) {
				const timeout = setTimeout(() => {
					window.scrollTo({
						behavior: 'smooth',
						top: commentWrapperRef.current.offsetTop
					});
				}, 500);
				commentWrapperRef.current.classList.remove('bg-grey_tertiary');
				commentWrapperRef.current.classList.remove('border-transparent');
				commentWrapperRef.current.classList.add('border-blue_primary');
				commentContentRef.current.classList.remove('border-b');
				return () => {
					clearTimeout(timeout);
				};
			}
		}
	}, [asPath, comment.id]);

	if (!comment) return null;
	const { user_address, created_at, content, history, id } = comment;

	return (
		<section id={id} ref={commentWrapperRef} className='flex gap-x-[10px] rounded-md p-2 pb-0  border border-solid border-transparent relative'>
			<article className='w-10'>
				<CommentedUserImage />
			</article>
			<article ref={commentContentRef} className='flex-1 flex flex-col border-0 border-b border-solid border-blue_primary pb-5'>
				<section className='flex flex-col gap-y-2'>
					<CommentHeader
						created_at={created_at}
						history={history}
						user_address={user_address}
					/>
					<CommentContent
						content={content}
					/>
					<CommentFooter
						comment={comment}
					/>
				</section>
				<RepliesWrapper />
			</article>
		</section>
	);
};

export default Comment;