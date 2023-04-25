// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { SearchOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React from 'react';
import TownhallLogoWithNamePNG from '~assets/logo/townhall-with-name.svg';
import Buttons from './Buttons';
import JoinedRoom from './JoinedRooms';
const { Header } = Layout;

const NavHeader = () => {
	return (
		<Header className='h-min p-0 m-0 flex flex-col bg-transparent'>
			<section className='px-[50px] py-4 border-0 border-b-[1.5px] border-solid border-blue_primary flex items-center justify-between text-grey_primary m-0'>
				<div className='flex items-center gap-x-2'>
					<SearchOutlined className='text-white text-sm' />
					<input placeholder='Search for anything' className='text-grey_primary placeholder:text-grey_primary m-0 p-0 flex items-center justify-center border-none outline-none max-h-[30px] bg-transparent text-xl font-normal leading-[24px]' />
				</div>
				<Buttons />
			</section>
			<section className='px-[50px] py-4 border-0 border-b-[1.5px] border-solid border-blue_primary flex items-center justify-between text-grey_primary m-0'>
				<div className='flex items-center justify-center max-h-[35.97px]'>
					<TownhallLogoWithNamePNG />
				</div>
				<JoinedRoom />
			</section>
		</Header>
	);
};

export default NavHeader;