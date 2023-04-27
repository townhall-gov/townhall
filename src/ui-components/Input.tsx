// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';

interface IInputProps {
    value: string;
    onChange: (v: string) => void;
    type: 'email' | 'text' | 'password' | 'tel';
    placeholder?: string;
    className?: string;
}

const Input: FC<IInputProps> = (props) => {
	const { className, onChange, type, value, placeholder } = props;
	return (
		<input
			value={value}
			onChange={(e) => {
				onChange(e.target.value);
			}}
			type={type}
			className={classNames('w-full flex-1 bg-transparent flex items-center justify-center border border-solid border-blue_primary outline-none rounded-2xl px-[18.5px] py-[21.5px] text-[#ABA3A3] placeholder:text-[#ABA3A3] font-normal text-lg leading-[22px]', className)}
			placeholder={placeholder}
		/>
	);
};

export default Input;