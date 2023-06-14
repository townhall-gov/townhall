// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC, useState } from 'react';

interface IAddProps {
    addTag: (tag: string) => void;
	isDisabled?: boolean;
}

const Add: FC<IAddProps> = (props) => {
	const { addTag, isDisabled } = props;
	const [tag, setTag] = useState('');
	return (
		<>
			<input
				disabled={isDisabled}
				onChange={(e) => {
					setTag(e.target.value);
				}}
				value={tag}
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						addTag(tag);
						setTag('');
					}
				}}
				className='bg-transparent outline-none border-none p-0 m-0 placeholder:text-[#ABA3A3] text-white'
				type="text"
				placeholder='eg. blockchain'
			/>
		</>
	);
};

export default Add;