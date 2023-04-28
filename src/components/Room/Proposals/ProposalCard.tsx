// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClockCircleOutlined, LikeOutlined, DislikeOutlined, CommentOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { FC } from 'react';
import { IProposal } from '~src/types/schema';
import Address from '~src/ui-components/Address';
import getRelativeCreatedAt from '~src/utils/getRelativeCreatedAt';
import Divider from './Divider';
import Tags from './Tags';

interface IProposalCardProps {
    proposal: IProposal;
}

const ProposalCard: FC<IProposalCardProps> = (props) => {
	const { proposal } = props;
	if (!proposal) return null;
	const { room_id, house_id, id, proposer_address, title, tags } = proposal;
	return (
		<Link
			href={`/house/${house_id}/room/${room_id}/proposal/${id}`}
			className='bg-[#04152F] rounded-2xl py-5 px-[18.5px] text-white'
		>
			<section className='flex flex-col m-0'>
				<article className='flex flex-col gap-y-[15px]'>
					<Address
						betweenIdenticonAndAddress={<span className='font-medium text-lg leading-[22px] tracking-[0.01em] -mx-[2px]'>By</span>}
						className='font-medium text-lg leading-[22px] tracking-[0.01em] '
						identiconSize={20}
						ethIdenticonSize={20}
						address={proposer_address}
						addressMaxLength={10}
					/>
					<p className='m-0 p-0'>
						{title}
					</p>
				</article>
			</section>
			<section className='mt-[18px] flex items-center justify-between m-0'>
				<article className='flex items-center gap-x-3 font-normal text-xs leading-[22px] text-grey_primary'>
					<p className='flex items-center gap-x-[6px] m-0 p-0'>
						<ClockCircleOutlined />
						<span>
							{getRelativeCreatedAt(proposal.created_at)}
						</span>
					</p>
					<Divider />
					<p className='flex items-center gap-x-[6px] m-0 p-0'>
						<LikeOutlined />
						<span>
                            23k
						</span>
					</p>
					<Divider />
					<p className='flex items-center gap-x-[6px] m-0 p-0'>
						<DislikeOutlined />
						<span>
                            2k
						</span>
					</p>
					<Divider />
					<p className='flex items-center gap-x-[6px] m-0 p-0'>
						<CommentOutlined />
						<span>
                            2k
						</span>
					</p>
				</article>
				<Tags tags={tags} />
			</section>
		</Link>
	);
};

export default ProposalCard;