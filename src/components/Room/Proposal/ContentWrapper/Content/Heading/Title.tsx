// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';

interface ITitleProps {
    title: string;
	id: number;
}

const Title: FC<ITitleProps> = (props) => {
	const { id, title } = props;
	return (
		<h2
			className='text-white font-medium text-xl leading-6 tracking-[0.01em] m-0'
		>
			{(id || id == 0)? <span className='font-bold'>#{id}</span>: null}{' '}{title}
		</h2>
	);
};

export default Title;