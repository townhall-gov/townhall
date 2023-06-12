// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import React from 'react';

const BackButton = () => {
	const router = useRouter();
	return (
		<button onClick={() => router.back()} className='outline-none border-none text-[#90A0B7] font-normal text-sm leading-[17px] bg-transparent cursor-pointer flex items-center justify-center gap-x-2'>
			<LeftOutlined className='text-xs' />
			<span>Back</span>
		</button>
	);
};

export default BackButton;