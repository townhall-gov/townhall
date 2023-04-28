// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { Skeleton } from 'antd';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import EthIdenticon from './EthIdenticon';

const Identicon = dynamic(() => import('@polkadot/react-identicon'), {
	loading: () => <Skeleton.Avatar active size='large' shape='circle' /> ,
	ssr: false
});

interface IAddressProps {
    address: string;
    className?: string;
    disableIdenticon?: boolean;
    ethIdenticonSize?: number;
    identiconSize?: number;
    addressMaxLength?: number;
	addressClassName?: string;
	betweenIdenticonAndAddress?: JSX.Element;
}

const shortenAddress = (address: string, maxLength: number) => {
	if (address.length <= maxLength) {
		return address;
	}

	const startStr = address.slice(0, maxLength / 2 - 1);
	const endStr = address.slice(address.length - maxLength / 2 + 1);

	return `${startStr}...${endStr}`;
};

const Address: FC<IAddressProps> = (props) => {
	const { address, addressMaxLength, className, disableIdenticon, ethIdenticonSize, identiconSize, addressClassName, betweenIdenticonAndAddress } = props;
	return (
		<div className={classNames('flex items-center gap-x-2', className)}>
			{
				disableIdenticon !== true?
					address.startsWith('0x') ?
						<EthIdenticon
							className='flex items-center justify-center'
							size={ethIdenticonSize? ethIdenticonSize: 32}
							address={address}
						/>
						:
						<Identicon
							className=''
							value={address}
							size={identiconSize? identiconSize: 32}
							theme={'polkadot'}
						/>
					: null
			}
			{betweenIdenticonAndAddress}
			<p id="addressText" className={classNames('m-0 p-0 text-white', addressClassName)}>
				{shortenAddress(address, addressMaxLength || 15)}
			</p>
		</div>
	);
};

export default Address;