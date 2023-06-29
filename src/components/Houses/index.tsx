// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import House from './House';
import { useHousesSelector } from '~src/redux/selectors';

interface IHousesProps {}

const Houses: FC<IHousesProps> = () => {
	const { houses } = useHousesSelector();
	if (!houses) {
		return null;
	}
	return (
		<section className='flex items-center flex-wrap gap-[50px]'>
			{
				houses.map((house) => {
					return (
						<House
							key={house.id}
							house={house}
						/>
					);
				})
			}
		</section>
	);
};

export default Houses;