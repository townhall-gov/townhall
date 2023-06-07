// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Layout } from 'antd';
import React from 'react';
import TownhallLogoWithNamePNG from '~assets/logo/townhall-with-name.svg';
import Buttons from './Buttons';
const { Header } = Layout;

const NavHeader = () => {
	return (
		<Header className='h-min z-[1001] sticky top-0 p-0 m-0 flex flex-col bg-app_background'>
			<section className='px-[50px] pt-[20px] pb-[22.5px] border-0 border-b-[1.5px] border-solid border-blue_primary flex items-center justify-between text-grey_primary m-0'>
				<div className='flex items-center justify-center max-h-[35.97px]'>
					<TownhallLogoWithNamePNG />
				</div>
				<Buttons />
			</section>
		</Header>
	);
};

export default NavHeader;