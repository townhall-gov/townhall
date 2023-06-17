// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { RightCircleOutlined, TwitterOutlined, GithubOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { Layout } from 'antd';
import Link from 'next/link';

const { Footer: AntdFooter } = Layout;

interface IFooterProps {
	className?: string;
}

const Footer: FC<IFooterProps> = () => {
	return (
		<AntdFooter className='bg-black rounded-t-[40px] grid grid-cols-4 px-[25px] gap-x-5py-10'>
			<article className='col-span-1 flex flex-col gap-y-[14px]'>
				<h6 className='m-0 p-0 text-base font-normal leading-[20px] text-grey_primary'>Get the latest Townhall updates</h6>
				<div className='flex items-center relative border border-solid border-grey_primary rounded-2xl max-w-[292px] pr-2'>
					<input
						className='flex-1 flex items-center justify-center m-0 p-0 border-none min-h-[40px] bg-transparent rounded-l-2xl px-2 py-[10px] outline-none text-grey_primary placeholder:text-grey_primary'
						placeholder='Your Email'
					/>
					<RightCircleOutlined className='text-grey_primary text-xl' />
				</div>
			</article>
			<article className='col-span-1 flex justify-center'>
				<ul className='m-0 p-0 flex flex-col justify-between gap-x-2 text-white list-none'>
					<li className='m-0 p-0 flex items-center'>
						<Link className='text-white text-base leading-[20px] font-light' href='/about'>About</Link>
					</li>
					<li className='m-0 p-0 flex items-center'>
						<Link className='text-white text-base leading-[20px] font-light' href='/contact-us'>Contact Us</Link>
					</li>
				</ul>
			</article>
			<article className='col-span-1 flex flex-col '>
				<p className='m-0 p-0 text-grey_primary leading-[22px] text-lg'>Join Townhall Community</p>
				<div
					className='flex items-center gap-x-2'
				>
					<a href='https://twitter.com/townhallgov' target='_blank' className='mt-2 flex items-center text-white text-base gap-x-[16.33px]' rel="noreferrer">
						<TwitterOutlined />
					</a>
					<a href='https://github.com/townhall-gov/townhall' target='_blank' className='mt-2 flex items-center text-white text-base gap-x-[16.33px]' rel="noreferrer">
						<GithubOutlined />
					</a>
				</div>
			</article>
			<article className='col-span-1'>
				<span className='text-white text-xs leading-[15px] tracking-[0.02em] font-normal'>&#169; 2023 Polkassembly</span>
			</article>
		</AntdFooter>
	);
};

export default Footer;