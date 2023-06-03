// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';

interface IInputProps {
    value: string | number;
    onChange: (v: string) => void;
    type: 'email' | 'text' | 'password' | 'tel' | 'number';
    placeholder?: string;
    className?: string;
	isDisabled?: boolean;
}

const Input: FC<IInputProps> = (props) => {
	const { className, onChange, type, value, placeholder, isDisabled } = props;
	return (
		<input
			disabled={isDisabled}
			value={value}
			onChange={(e) => {
				onChange(e.target.value);
			}}
			type={type}
			className={classNames('w-full flex-1 bg-transparent flex items-center justify-center border border-solid border-blue_primary outline-none rounded-2xl px-[18.5px] py-[21.5px] text-white placeholder:text-[#ABA3A3] font-normal text-lg leading-[22px]', className, {
				'cursor-not-allowed': isDisabled,
				'cursor-text': !isDisabled
			})}
			placeholder={placeholder}
		/>
	);
};

export default Input;