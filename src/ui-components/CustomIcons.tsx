// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Icon from '@ant-design/icons';
import React from 'react';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

import ConnectWalletSVG  from '~assets/icons/connect-wallet.svg';
import ThreeDotsSVG  from '~assets/icons/3-dots.svg';
import TownhallLogoWithNameSVG  from '~assets/logo/townhall-with-name.svg';
import MetamaskSVG  from '~assets/wallet/metamask-icon.svg';
import PolkadotJsSVG  from '~assets/wallet/polkadotjs-icon.svg';

export const ConnectWalletIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ConnectWalletSVG} {...props} />
);

export const ThreeDotsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ThreeDotsSVG} {...props} />
);

export const TownhallLogoWithNameIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={TownhallLogoWithNameSVG} {...props} />
);

export const MetamaskIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={MetamaskSVG} {...props} />
);

export const PolkadotJsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={PolkadotJsSVG} {...props} />
);