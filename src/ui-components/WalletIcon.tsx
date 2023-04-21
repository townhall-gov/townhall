// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { MetamaskIcon, PolkadotJsIcon } from './CustomIcons';

export enum EWallet {
    POLKADOT_JS = 'polkadot-js',
    METAMASK = 'metamask'
}

interface IWalletIconProps {
    type: EWallet;
    className?: string;
}

const WalletIcon: FC<IWalletIconProps> = (props) => {
	switch(props.type) {
	case EWallet.METAMASK:
		return <MetamaskIcon className={props.className} />;
	case EWallet.POLKADOT_JS:
		return <PolkadotJsIcon className={props.className} />;
	default:
		return null;
	}
};

export default WalletIcon;