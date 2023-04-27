// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag } from 'antd';
import React, { FC, useState } from 'react';

interface IAddProps {
    addTag: (tag: string) => void;
}

const Add: FC<IAddProps> = (props) => {
	const { addTag } = props;
	const [inputVisible, setInputVisible] = useState(false);
	const [tag, setTag] = useState('');
	return (
		<div>
			{
				inputVisible?
					<Input
						onChange={(e) => {
							setTag(e.target.value);
						}}
						value={tag}
						onPressEnter={() => {
							addTag(tag);
							setTag('');
							setInputVisible(false);
						}}
						className='bg-transparent border border-solid border-blue_primary text-white flex items-center justify-center rounded-md px-2 py-[1px] placeholder:text-[#ABA3A3] outline-none max-w-[115px] lowercase m-0'
						type="text"
						placeholder='eg. blockchain'
					/>
					: <Tag
						onClick={() => {
							setInputVisible(true);
						}}
						className='bg-blue_primary text-white border border-solid border-blue_primary flex items-center justify-center cursor-pointer py-[1px] m-0'
					>
						<PlusOutlined />
						<span>Add Tag</span>
					</Tag>
			}

		</div>
	);
};

export default Add;