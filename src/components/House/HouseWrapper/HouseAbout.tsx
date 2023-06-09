// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';

interface IHouseAboutProps {
    description: string;
}

const HouseAbout: FC<IHouseAboutProps> = (props) => {
	const { description } = props;
	return (
		<article className='text-white rounded-2xl border border-solid border-blue_primary flex-1 p-6 h-full'>
			<h2 className='font-medium text-[28px] leading-[34px] tracking-[0.01em] m-0 mb-[10px]'>
                About
			</h2>
			<p
				className='m-0 mb-[20px] text-[#90A0B7] font-normal text-sm leading-[17px]'
			>
				{
					description
				}
			</p>
		</article>
	);
};

export default HouseAbout;