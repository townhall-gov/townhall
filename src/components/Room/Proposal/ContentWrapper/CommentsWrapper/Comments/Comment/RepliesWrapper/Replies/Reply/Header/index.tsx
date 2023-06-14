// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClockCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { FC } from 'react';
import { IHistoryComment } from '~src/types/schema';
import Address from '~src/ui-components/Address';
import getRelativeCreatedAt from '~src/utils/getRelativeCreatedAt';
import EditHistory from './EditHistory';

interface ICommentHeaderProps {
    user_address: string;
	created_at: Date;
	updated_at: Date;
	history: IHistoryComment[];
    comment_id:string;
}

const ReplyHeader: FC<ICommentHeaderProps> = (props) => {
	const { created_at, updated_at, user_address, history } = props;
	return (
		<article className='flex items-center gap-x-2'>
			<div className='flex items-center gap-x-2 m-0 text-base text-white font-medium leading-[20px] tracking-[0.01em]'>
				<span>By</span>
				{
					!user_address?
						<span>{'Xyz'}</span>
						: (
							<Address
								addressMaxLength={8}
								identiconSize={20}
								ethIdenticonSize={20}
								address={user_address}
								addressClassName='text-base font-medium leading-[20px] tracking-[0.01em]'
							/>
						)
				}
			</div>
			<span className='text-lg leading-none text-grey_light flex items-center'>
                &#183;
			</span>
			<p className='flex items-center gap-x-[6px] m-0 p-0 text-xs font-normal leading-[15px] text-grey_light'>
				<ClockCircleOutlined />
				<span>
					{getRelativeCreatedAt(created_at)}
				</span>
			</p>
			{
				updated_at.toString() === created_at.toString()?
					null
					: <Tooltip color='#66A5FF' title={getRelativeCreatedAt(updated_at)}>
						<span className='flex items-center gap-x-[6px] m-0 p-0 text-xs font-normal leading-[15px] text-grey_light'>(edited)</span>
					</Tooltip>
			}
			{
				history && history.length > 0?
					<>
						<span className='text-lg leading-none text-grey_light flex items-center'>
							&#183;
						</span>
						<EditHistory history={history || []} />
					</>
					: null
			}
		</article>
	);
};

export default ReplyHeader;