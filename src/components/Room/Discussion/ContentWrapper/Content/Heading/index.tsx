// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import Tags from '~src/components/Room/Proposals/Tags';
import Address from '~src/ui-components/Address';
import Title from '~src/components/Room/Proposal/ContentWrapper/Content/Heading/Title';
import ProposalHouse from '~src/components/Room/Proposal/ContentWrapper/Content/Heading/ProposalHouse';
import Edit from './Edit';

interface IHeadingProps {
    title: string;
    tags: string[];
    address: string;
	id: number;
	house_id: string;
}

const Heading: FC<IHeadingProps> = (props) => {
	const { title, tags, address, id } = props;
	return (
		<header
			className='rounded-2xl bg-dark_blue_primary py-8 px-7 text-white flex flex-col gap-y-[30px]'
		>
			{
				title? (
					<Title id={id} title={title} />
				): null
			}
			<article className='flex items-center justify-between gap-x-5'>
				<div className='flex items-center gap-x-3'>
					<ProposalHouse house_id={props.house_id} />
					<Address
						identiconSize={20}
						ethIdenticonSize={20}
						betweenIdenticonAndAddress={<span className='text-grey_tertiary font-medium text-base leading-[20px] tracking-[0.01em]'>By</span>}
						address={address}
						addressMaxLength={10}
						className='text-grey_tertiary font-medium text-base leading-[20px] tracking-[0.01em]'
					/>
					<Edit />
				</div>
				<div
					className='flex items-center gap-x-[11.5px]'
				>
					<Tags tags={tags} />
				</div>
			</article>
		</header>
	);
};

export default Heading;