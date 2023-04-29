// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import Title from './Title';
import { KusamaIcon } from '~src/ui-components/CustomIcons';
import Tags from '~src/components/Room/Proposals/Tags';
import Address from '~src/ui-components/Address';

interface IHeadingProps {
    title: string;
    tags: string[];
    address: string;
	id: number;
}

const Heading: FC<IHeadingProps> = (props) => {
	const { title, tags, address, id } = props;
	return (
		<header
			className='rounded-2xl bg-[#04152F] py-8 px-7 text-white flex flex-col gap-y-[30px]'
		>
			{
				title? (
					<Title id={id} title={title} />
				): null
			}
			<article className='flex items-center justify-between gap-x-5'>
				<div className='flex items-center gap-x-3'>
					<p className='flex items-center font-semibold text-base leading-[20px] tracking-[0.01em] text-grey_tertiary gap-x-1 m-0 p-0'>
						<KusamaIcon className='text-xl' />
						<span>Kusama</span>
					</p>
					<span
						className='text-sm leading-[17px] text-grey_tertiary font-normal tracking-[0.01em]'
					>
                        by
					</span>
					<Address
						identiconSize={20}
						ethIdenticonSize={20}
						betweenIdenticonAndAddress={<span className='text-grey_tertiary font-medium text-base leading-[20px] tracking-[0.01em]'>By</span>}
						address={address}
						addressMaxLength={10}
						className='text-grey_tertiary font-medium text-base leading-[20px] tracking-[0.01em]'
					/>
				</div>
				<div>
					<Tags tags={tags} />
				</div>
			</article>
		</header>
	);
};

export default Heading;