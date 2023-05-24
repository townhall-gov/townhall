// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';

interface IDividerProps {
    className?: string;
}

const Divider: FC<IDividerProps> = (props) => {
	const { className } = props;
	return (
		<span
			className={
				classNames('w-1 flex items-center justify-center', className)
			}
		>
            |
		</span>
	);
};

export default Divider;