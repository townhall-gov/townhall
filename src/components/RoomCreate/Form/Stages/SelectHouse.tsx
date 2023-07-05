// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import HouseDropdown from '~src/ui-components/HouseDropdown';
import Error from '../Error';
import { removeError } from '~src/redux/rooms/validation';
import { useRoomsSelector } from '~src/redux/selectors';
import { InfoDiamondIcon } from '~src/ui-components/CustomIcons';

const SelectHouse = () => {
	const { roomCreation } = useRoomsSelector();
	const { select_house } = roomCreation;
	return (
		<article>
			<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
                A House is Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..
			</p>
			<div className='my-[28px]'>
				<HouseDropdown onClick={() => removeError('select_house')} />
				<Error id='select_house' />
				{
					select_house && !select_house?.is_erc20 && <div className='px-[18.5px] py-[21.5px] flex justify-center text-sm text-white mt-[24px] items-center border border-solid border-red_primary rounded-2xl'>
						<InfoDiamondIcon className='text-[30px] mr-2 text-transparent stroke-white'/>
						<span className='text-[18px]'>Lorem Ipsum</span>
					</div>
				}
			</div>
			<div className='flex flex-col gap-y-2'>
				<h5 className='m-0 p-0 font-semibold text-lg leading-[23px] text-white'>
                    Don{'\''}t see a house for your blockchain?
				</h5>
				<button className='flex items-center justify-center outline-none border border-solid border-blue_primary rounded-2xl py-2 px-[15px] text-blue_primary max-w-[331px] bg-transparent'>
                    Request a House for your Blockchain
				</button>
			</div>
		</article>
	);
};

export default SelectHouse;