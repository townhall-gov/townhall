// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import ReactHTMLParser from 'react-html-parser';
import { useHousesSelector, useProposalSelector } from '~src/redux/selectors';

const PostLink = () => {
	const { proposal } = useProposalSelector();
	const { houses } = useHousesSelector();
	const [image, setImage] = useState('');
	useEffect(() => {
		if (houses && Array.isArray(houses)) {
			const house = houses.find((house) => house.id === proposal?.post_link?.house_id);
			if (house) {
				setImage(house.logo);
			}
		}
	}, [houses, proposal]);
	if (!proposal || !proposal.post_link || !proposal.post_link_data) return null;
	const { description, title } = proposal.post_link_data;
	return (
		<section>
			<h3 className='m-0 text-white tracking-[0.01em] font-medium text-xl leading-[24px]'>
                Linked Discussion
			</h3>
			<article className='rounded-2xl mt-4 py-[19px] px-[20px] border border-solid border-blue_primary flex items-center gap-x-2'>
				{
					image?
						<img src={image} alt='post link image' width={44} height={44} />
						: null
				}
				<div>
					<h4 className='m-0 text-lg font-medium leading-[22px] tracking-[0.01em] text-white'>{title}</h4>
					<div className='html-content text-white font-normal text-sm leading-[23px] tracking-[0.01em] max-h-[23px] overflow-hidden'>
						{ReactHTMLParser(description)}
					</div>
				</div>
			</article>
		</section>
	);
};

export default PostLink;