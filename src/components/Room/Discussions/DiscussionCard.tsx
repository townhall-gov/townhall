// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClockCircleOutlined, LikeOutlined, DislikeOutlined, CommentOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { FC } from 'react';
import { IListingDiscussion } from '~src/redux/room/@types';
import Address from '~src/ui-components/Address';
import getRelativeCreatedAt from '~src/utils/getRelativeCreatedAt';
import Divider from '../Proposals/Divider';
import { EReaction } from '~src/types/enums';
import Tags from '../Proposals/Tags';

interface IDiscussionCardProps {
    discussion: IListingDiscussion;
}

const DiscussionCard: FC<IDiscussionCardProps> = (props) => {
	const { discussion } = props;
	if (!discussion) return null;
	const { created_at, room_id, house_id, id, proposer_address, title, tags, comments_count, reactions_count } = discussion;
	return (
		<Link
			href={`/${house_id}/${room_id}/discussion/${id}`}
			className='bg-dark_blue_primary rounded-2xl py-5 px-[18.5px] text-white'
		>
			<section className='flex flex-col m-0'>
				<article className='flex flex-col gap-y-[15px]'>
					<div
						className='flex items-center justify-between gap-x-5'
					>
						<Address
							betweenIdenticonAndAddress={<span className='font-medium text-lg leading-[22px] tracking-[0.01em] -mx-[2px]'>By</span>}
							className='font-medium text-lg leading-[22px] tracking-[0.01em] '
							identiconSize={20}
							ethIdenticonSize={20}
							address={proposer_address}
							addressMaxLength={10}
						/>
					</div>
					<p className='m-0 p-0'>
						#{id} {title}
					</p>
				</article>
			</section>
			<section className='mt-[18px] flex items-center justify-between m-0'>
				<article className='flex items-center gap-x-3 font-normal text-xs leading-[22px] text-grey_primary'>
					<p className='flex items-center gap-x-[6px] m-0 p-0'>
						<ClockCircleOutlined />
						<span>
							{getRelativeCreatedAt(created_at)}
						</span>
					</p>
					<Divider />
					<p className='flex items-center gap-x-[6px] m-0 p-0'>
						<LikeOutlined />
						<span>
							{reactions_count[EReaction.LIKE]}
						</span>
					</p>
					<Divider />
					<p className='flex items-center gap-x-[6px] m-0 p-0'>
						<DislikeOutlined />
						<span>
							{reactions_count[EReaction.DISLIKE]}
						</span>
					</p>
					<Divider />
					<p className='flex items-center gap-x-[6px] m-0 p-0'>
						<CommentOutlined />
						<span>
							{comments_count}
						</span>
					</p>
				</article>
				<Tags tags={tags} />
			</section>
		</Link>
	);
};

export default DiscussionCard;