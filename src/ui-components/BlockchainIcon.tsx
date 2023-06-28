// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { KusamaIcon, PolkadotIcon, MoonbaseIcon, MoonbeamIcon, MoonriverIcon, StatemineIcon, AcalaIcon, AstarIcon, CentrifugeIcon, KiltIcon, PendulumIcon, KaruraIcon, BifrostIcon } from './CustomIcons';
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
	case EBlockchain.MOONBASE:
		return <MoonbaseIcon className={props.className} />;
	case EBlockchain.MOONBEAM:
		return <MoonbeamIcon className={props.className} />;
	case EBlockchain.MOONRIVER:
		return <MoonriverIcon className={props.className} />;
	case EBlockchain.STATEMINE:
		return <StatemineIcon className={props.className} />;
	case EBlockchain.ACALA:
		return <AcalaIcon className={props.className} />;
	case EBlockchain.ASTAR:
		return <AstarIcon className={props.className} />;
	case EBlockchain.BIFROST:
		return <BifrostIcon className={props.className} />;
	case EBlockchain.CENTRIFUGE:
		return <CentrifugeIcon className={props.className} />;
	case EBlockchain.KILT:
		return <KiltIcon className={props.className} />;
	case EBlockchain.PENDULUM:
		return <PendulumIcon className={props.className} />;
	case EBlockchain.KARURA:
		return <KaruraIcon className={props.className} />;
	default:
		return null;
	}
};

export default BlockchainIcon;