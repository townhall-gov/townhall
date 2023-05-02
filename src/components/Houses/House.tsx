// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Link from 'next/link';
import React, { FC } from 'react';
import { IHouse } from '~src/types/schema';
import BlockchainIcon from '~src/ui-components/BlockchainIcon';
import { CropFreeIcon } from '~src/ui-components/CustomIcons';

interface IHouseProps extends IHouse {}

const House: FC<IHouseProps> = (props) => {
	const { blockchain, title, id, total_members } = props;

	return (
		<Link href={`/house/${id}/rooms`} className='border border-solid border-blue_primary rounded-lg outline-none flex flex-col gap-y-2 items-center bg-transparent p-5 px-7 cursor-pointer min-w-[188px] min-h-[186px]'>
			<BlockchainIcon className='text-[45px]' type={blockchain} />
			<h3 className='text-white m-0 p-0 text-2xl leading-[29px] tracking-[0.01em] font-semibold'>{title}</h3>
			<p className='m-0 text-sm font-normal leading-[17px] text-grey_tertiary'>
				{total_members} Members
			</p>
			<CropFreeIcon className='text-[#94A2AF] text-lg mt-[3px]' />
		</Link>
	);
};

export default House;