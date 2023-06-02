// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Image } from 'antd';
import React, { FC } from 'react';
import { IHouse } from '~src/types/schema';

interface IHouseFieldProps {
    house: IHouse;
}

const HouseField: FC<IHouseFieldProps> = (props) => {
	const { house: { logo, title, description } } = props;
	return (
		<div className='flex items-center gap-x-3'>
			<div className='flex items-center justify-center'>
				<Image preview={false} width={30} height={30} className='rounded-full' src={logo} alt='room logo' />
			</div>
			<div className='flex flex-col gap-y-1 text-white'>
				<h5 className='m-0 p-0 text-sm leading-none'>{title}</h5>
				<p className='m-0 p-0 text-[10px]'>{description}</p>
			</div>
		</div>
	);
};

export default HouseField;