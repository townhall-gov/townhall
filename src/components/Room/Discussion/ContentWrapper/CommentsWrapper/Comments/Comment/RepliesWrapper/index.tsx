// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { FC, useState } from 'react';
import Replies from './Replies';
import { useReplyBoxVisibility } from '~src/redux/discussion/selectors';

import { IReply } from '~src/types/schema';
import CreateReply from './CreateReply';

interface IRepliesWrapperProps {
	replies: IReply[] | null;
    comment_id: string;
}

const RepliesWrapper :FC<IRepliesWrapperProps>= (props) => {
	const { replies, comment_id } = props;
	const { replyBox_comment_id, replyBox_isVisible } = useReplyBoxVisibility();
	const [isRepliesVisible, setIsRepliesVisible] = useState(true);
	return (
		<section className='mt-3'>
			{
				replyBox_isVisible && replyBox_comment_id === comment_id  && (
					<CreateReply comment_id={comment_id} />
				)
			}
			<div>
				{
					replies && Array.isArray(replies) && replies.length > 0?
						<>
							<button
								className="cursor-pointer outline-none border-none flex items-center gap-x-2 font-normal text-xs leading-[22px] text-blue_primary bg-transparent"
								onClick={() => setIsRepliesVisible((prev) => !prev)}
							>
								{
									isRepliesVisible?
										<>
											<span>Hide Replies</span>
											<UpOutlined />
										</>
										: <>
											<span>Show Replies</span>
											<DownOutlined />
										</>
								}
							</button>
							{
								isRepliesVisible?
									<Replies
										replies={replies}
									/>
									: null
							}
						</>
						: null
				}
			</div>
		</section>

	);
};

export default RepliesWrapper;