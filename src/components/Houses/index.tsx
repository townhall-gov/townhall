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
		<section className='grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 justify-between gap-[50px]'>
			{
				houses.map((house, index) => {
					return (
						<>
							<House
								key={index}
								house={house}
							/>
						</>
					);
				})
			}
		</section>
	);
};

export default Houses;