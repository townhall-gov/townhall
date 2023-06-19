// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import dayjs from 'dayjs';
import React from 'react';
import ReactHTMLParser from 'react-html-parser';
import { useCommentEditHistory } from '~src/redux/discussion/selectors';
import getRelativeCreatedAt from '~src/utils/getRelativeCreatedAt';

const EditHistoryModalContent = () => {
	const history = useCommentEditHistory();
	return (
		<section className='mt-5 flex flex-col gap-y-6'>
			{
				history.sort((a, b) => dayjs(b.created_at).diff(a.created_at)).map((item, index) => {
					return (
						<article key={index}>
							<h4 className='flex m-0 items-center gap-x-2 text-base text-blue_primary'>
								<span>Created at:</span>
								<span>
									{getRelativeCreatedAt(item.created_at)}
								</span>
							</h4>
							<div className='html-content text-white font-normal text-sm leading-[23px] tracking-[0.01em] p-2 border border-solid border-blue_primary rounded-md'>
								{ReactHTMLParser(item.content)}
							</div>
						</article>
					);
				})
			}
		</section>
	);
};

export default EditHistoryModalContent;