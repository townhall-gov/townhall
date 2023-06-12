// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Image } from 'antd';
import React, { FC } from 'react';
import { useSelectedHouse } from '~src/redux/houses/selectors';
import { firstCharUppercase } from '~src/utils/getFirstCharUppercase';

interface IProposalHouseProps {
    house_id: string;
}

const ProposalHouse: FC<IProposalHouseProps> = (props) => {
	const house = useSelectedHouse(props.house_id);
	if (!house) return null;
	return (
		<>
			<div className='flex items-center font-semibold text-base leading-[20px] tracking-[0.01em] text-grey_tertiary gap-x-1 m-0 p-0'>
				<Image preview={false} width={25} height={25} className='rounded-full' src={house.logo} alt='room logo' />
				<span>{firstCharUppercase(house.blockchain)}</span>
			</div>
			<span
				className='text-sm leading-[17px] text-grey_tertiary font-normal tracking-[0.01em]'
			>
                by
			</span>
		</>
	);
};

export default ProposalHouse;