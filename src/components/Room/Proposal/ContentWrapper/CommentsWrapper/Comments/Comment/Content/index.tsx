// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import ReactHTMLParser from 'react-html-parser';

interface ICommentContentProps {
    content: string;
}

const CommentContent: FC<ICommentContentProps> = (props) => {
	const { content } = props;
	return (
		<div className='html-content text-white font-normal text-sm leading-[23px] tracking-[0.01em]'>
			{ReactHTMLParser(content)}
		</div>
	);
};

export default CommentContent;