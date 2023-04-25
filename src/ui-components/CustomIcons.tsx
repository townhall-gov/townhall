// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Icon from '@ant-design/icons';
import React from 'react';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

import ConnectWalletSVG  from '~assets/icons/connect-wallet.svg';
import ThreeDotsSVG  from '~assets/icons/3-dots.svg';
import HomeSVG  from '~assets/icons/home.svg';
import ContactPageSVG  from '~assets/icons/contact-page.svg';
import DevicesSVG  from '~assets/icons/devices.svg';
import EarthSVG  from '~assets/icons/earth.svg';
import HolidayVillageSVG  from '~assets/icons/holiday-village.svg';
import RocketLaunchSVG  from '~assets/icons/rocket-launch.svg';
import TownhallLogoWithNameSVG  from '~assets/logo/townhall-with-name.svg';
import MetamaskSVG  from '~assets/wallet/metamask-icon.svg';
import PolkadotJsSVG  from '~assets/wallet/polkadotjs-icon.svg';

import PolkadotSVG from '~assets/blockchain/polkadot.svg';
import KusamaSVG from '~assets/blockchain/kusama.svg';

export const ConnectWalletIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ConnectWalletSVG} {...props} />
);

export const ThreeDotsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ThreeDotsSVG} {...props} />
);

export const HomeIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={HomeSVG} {...props} />
);

export const ContactPageIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ContactPageSVG} {...props} />
);

export const DevicesIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={DevicesSVG} {...props} />
);

export const EarthIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={EarthSVG} {...props} />
);

export const HolidayVillageIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={HolidayVillageSVG} {...props} />
);

export const RocketLaunchIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={RocketLaunchSVG} {...props} />
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

export const PolkadotIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={PolkadotSVG} {...props} />
);

export const KusamaIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={KusamaSVG} {...props} />
);