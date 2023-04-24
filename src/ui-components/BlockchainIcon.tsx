// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { KusamaIcon, PolkadotIcon } from './CustomIcons';
import { EBlockchain } from '~src/types/enums';

interface IBlockchainIconProps {
    type: EBlockchain;
    className?: string;
}

const BlockchainIcon: FC<IBlockchainIconProps> = (props) => {
	switch(props.type) {
	case EBlockchain.KUSAMA:
		return <KusamaIcon className={props.className} />;
	case EBlockchain.POLKADOT:
		return <PolkadotIcon className={props.className} />;
	default:
		return null;
	}
};

export default BlockchainIcon;