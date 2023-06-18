// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';

interface IErrorProps {
    id: string;
}

const Error: FC<IErrorProps> = (props) => {
	const { id } = props;
	return (
		<p id={id} className='m-0 mt-2 text-red_primary font-normal text-xs leading-[15px] hidden room_creation_error'></p>
	);
};

export default Error;