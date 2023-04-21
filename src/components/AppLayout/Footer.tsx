// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { RightCircleOutlined, TwitterOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { Layout } from 'antd';
import Link from 'next/link';

const { Footer: AntdFooter } = Layout;

interface IFooterProps {
	className?: string;
}

const Footer: FC<IFooterProps> = () => {
	return (
		<AntdFooter className='bg-black grid grid-cols-3 gap-x-5 lg:py-[44.5px] lg:px-[183px]'>
			<article className='col-span-1 flex flex-col gap-y-[14px]'>
				<h6 className='m-0 p-0 text-base font-normal leading-[20px] text-grey_primary'>Get the latest Polkroom updates</h6>
				<div className='flex items-center relative border border-solid border-grey_primary rounded-2xl max-w-[292px] px-2'>
					<input
						className='flex-1 flex items-center justify-center m-0 p-0 border-none min-h-[40px] bg-transparent rounded-l-2xl px-2 py-[10px] outline-none text-grey_primary placeholder:text-grey_primary'
						placeholder='Your Email'
					/>
					<RightCircleOutlined className='text-grey_primary text-xl' />
				</div>
				<span className='text-white text-xs leading-[15px] tracking-[0.02em] font-normal'>&#169; 2023 Polkassembly</span>
			</article>
			<ul className='col-span-1 m-0 p-0 grid grid-cols-2 gap-x-2 text-grey_primary list-none'>
				<li className='col-span-1 m-0 p-0 flex items-center'>
					<Link className='text-grey_primary text-base leading-[20px] font-light' href='/about'>About</Link>
				</li>
				<li className='col-span-1 m-0 p-0 flex items-center'>
					<Link className='text-grey_primary text-base leading-[20px] font-light' href='/Jobs'>Jobs</Link>
				</li>
				<li className='col-span-1 m-0 p-0 flex items-center'>
					<Link className='text-grey_primary text-base leading-[20px] font-light' href='/blog'>Blog</Link>
				</li>
				<li className='col-span-1 m-0 p-0 flex items-center'>
					<Link className='text-grey_primary text-base leading-[20px] font-light' href='/contact-us'>Contact Us</Link>
				</li>
			</ul>
			<article>
				<button className='outline-none border border-solid rounded-[16px] cursor-pointer border-blue_primary text-blue_primary text-base leading-[20px] font-normal px-[18px] py-2 bg-transparent'>
					Request a House for your Blockchain
				</button>
				<div className='flex flex-col mt-[18px]'>
					<p className='m-0 p-0 text-grey_primary leading-[22px] text-lg'>Join Polkroom Community</p>
					<div className='mt-2 flex items-center text-white text-base gap-x-[16.33px]'>
						<TwitterOutlined />
					</div>
				</div>
			</article>
		</AntdFooter>
	);
};

export default Footer;