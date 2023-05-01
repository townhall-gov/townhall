// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { IComment } from '~src/types/schema';
import Comment from './Comment';

interface ICommentsProps {
	comments: IComment[];
	isAllCommentsVisible: boolean;
}

const Comments: FC<ICommentsProps> = (props) => {
	const { comments, isAllCommentsVisible } = props;
	return (
		<section className='text-white mt-5 flex flex-col gap-y-6'>
			{
				comments.map((comment, index) => {
					return (
						<Comment
							key={`${comment.id} + ${index}`}
							comment={comment}
							isAllCommentsVisible={isAllCommentsVisible}
						/>
					);
				})
			}
		</section>
	);
};

export default Comments;