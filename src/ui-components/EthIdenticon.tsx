// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Jazzicon from '@metamask/jazzicon';
import classNames from 'classnames';
import { FC, useEffect, useRef } from 'react';

interface IEthIdenticonProps {
    address: string;
    size: number;
    className?: string;
}

const EthIdenticon: FC<IEthIdenticonProps> = (props) => {
	const { address, size, className } = props;
	const ref = useRef<HTMLDivElement>();
	const numericAddress = parseInt(address.slice(2, 10), 16);

	useEffect(() => {
		if (numericAddress && ref.current) {
			ref.current.innerHTML = '';
			ref.current.appendChild(Jazzicon(size, numericAddress));
		}
	}, [numericAddress, size]);

	return (
		<div
			onClick={() => navigator.clipboard.writeText(address)}
			className={classNames('cursor-copy', className)}
			ref={ref as any}
		/>
	);
};

export default EthIdenticon;