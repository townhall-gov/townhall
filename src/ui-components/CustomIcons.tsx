// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Icon from '@ant-design/icons';
import React from 'react';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

import PenToolAddSVG from '~assets/icons/pen-tool-add.svg';
import FolderLinksSVG from '~assets/icons/folder-links.svg';
import PostLinkSVG from '~assets/icons/post-link.svg';
import DiscussionSVG from '~assets/icons/discussion.svg';
import HexWarningSVG from '~assets/icons/hex-warning.svg';
import ConnectWalletSVG from '~assets/icons/connect-wallet.svg';
import ThreeDotsSVG from '~assets/icons/3-dots.svg';
import HomeSVG from '~assets/icons/home.svg';
import ContactPageSVG from '~assets/icons/contact-page.svg';
import DevicesSVG from '~assets/icons/devices.svg';
import EarthSVG from '~assets/icons/earth.svg';
import CropFreeSVG from '~assets/icons/crop-free.svg';
import HolidayVillageSVG from '~assets/icons/holiday-village.svg';
import ZoomInAreaSVG from '~assets/icons/zoom-in-area.svg';
import RocketLaunchSVG from '~assets/icons/rocket-launch.svg';
import DiamondSVG from '~assets/icons/diamond.svg';
import PlusSignSquareSVG from '~assets/icons/plus-sign-square.svg';
import NoProposalsSVG from '~assets/icons/no-proposals.svg';
import ThumbUpSVG from '~assets/icons/thumb-up.svg';
import DeadlineSVG from '~assets/icons/deadline.svg';
import SortByDownSVG from '~assets/icons/sort-by-down.svg';
import SettingsSVG from '~assets/icons/settings.svg';
import TownhallLogoWithNameSVG from '~assets/logo/townhall-with-name.svg';
import RequestHouseSVG from '~assets/logo/request-house.svg';
import MetamaskSVG from '~assets/wallet/metamask-icon.svg';
import PolkadotJsSVG from '~assets/wallet/polkadotjs-icon.svg';

import PolkadotSVG from '~assets/blockchain/polkadot.svg';
import KusamaSVG from '~assets/blockchain/kusama.svg';
import MoonbaseSVG from '~assets/blockchain/moonbase.svg';
import MoonbeamSVG from '~assets/blockchain/moonbeam.svg';
import MoonriverSVG from '~assets/blockchain/moonriver.svg';
import StatemineSVG from '~assets/blockchain/statemine.svg';
import AcalaSVG from '~assets/blockchain/acala.svg';
import AstarSVG from '~assets/blockchain/astar.svg';
import BifrostSVG from '~assets/blockchain/bifrost.svg';
import CentrifugeSVG from '~assets/blockchain/centrifuge.svg';
import KaruraSVG from '~assets/blockchain/karura.svg';
import KiltSVG from '~assets/blockchain/kilt.svg';
import PendulumSVG from '~assets/blockchain/pendulum.svg';

import DiscordSVG from '~assets/socials/discord.svg';
import GithubSVG from '~assets/socials/github.svg';
import RedditSVG from '~assets/socials/reddit.svg';
import TelegramSVG from '~assets/socials/telegram.svg';
import TwitterSVG from '~assets/socials/twitter.svg';

// Sentiment Import Start
import AgainstSVG from '~assets/sentiment/against.svg';
import SlightlyAgainstSVG from '~assets/sentiment/slightly-against.svg';
import NeutralSVG from '~assets/sentiment/neutral.svg';
import SlightlyForSVG from '~assets/sentiment/slightly-for.svg';
import ForSVG from '~assets/sentiment/for.svg';
// Sentiment Import End

// Comment Related Icons Import Start
import ReplySVG from '~assets/icons/reply.svg';
import DeleteSVG from '~assets/icons/delete.svg';
import EditSVG from '~assets/icons/edit.svg';
import SearchSVG from '~assets/icons/searchicon.svg';
import FlagSVG from '~assets/icons/flag.svg';
import LinkSVG from '~assets/icons/link.svg';
import ShareSVG from '~assets/icons/share.svg';
import GeometricSVG from '~assets/icons/gerometric-shape.svg';
import LoadMoreSVG from '~assets/icons/loadmore.svg';
import HouseIconSVG from '~assets/icons/houseicon.svg';
import CancelIconSVG from '~assets/icons/cancel-square.svg';
import ToolTipIconSVG from '~assets/icons/tooltip-icon.svg';
// Comment Related Icons Import End

// Sentiment Icons Start
export const AgainstIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={AgainstSVG} {...props} />
);

export const SlightlyAgainstIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={SlightlyAgainstSVG} {...props} />
);

export const NeutralIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={NeutralSVG} {...props} />
);

export const SlightlyForIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={SlightlyForSVG} {...props} />
);

export const ForIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ForSVG} {...props} />
);
// Sentiment Icons End

// Comment Related Icons Start
export const ReplyIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ReplySVG} {...props} />
);
export const ShareIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ShareSVG} {...props} />
);
export const DeleteIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={DeleteSVG} {...props} />
);
export const EditIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={EditSVG} {...props} />
);
export const FlagIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={FlagSVG} {...props} />
);
export const LinkIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={LinkSVG} {...props} />
);
// Comment Related Icons End

export const DiscordIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={DiscordSVG} {...props} />
);

export const GithubIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={GithubSVG} {...props} />
);

export const RedditIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={RedditSVG} {...props} />
);

export const TelegramIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={TelegramSVG} {...props} />
);

export const TwitterIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={TwitterSVG} {...props} />
);

export const PenToolAddIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={PenToolAddSVG} {...props} />
);

export const FolderLinksIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={FolderLinksSVG} {...props} />
);

export const PostLinkIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={PostLinkSVG} {...props} />
);

export const DiscussionIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={DiscussionSVG} {...props} />
);

export const HexWarningIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={HexWarningSVG} {...props} />
);

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

export const CropFreeIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={CropFreeSVG} {...props} />
);

export const HolidayVillageIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={HolidayVillageSVG} {...props} />
);

export const ZoomInAreaIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ZoomInAreaSVG} {...props} />
);

export const RocketLaunchIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={RocketLaunchSVG} {...props} />
);

export const DiamondIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={DiamondSVG} {...props} />
);

export const GeometricIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={GeometricSVG} {...props} />
);

export const PlusSignSquareIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={PlusSignSquareSVG} {...props} />
);

export const NoProposalsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={NoProposalsSVG} {...props} />
);

export const ThumbUpIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ThumbUpSVG} {...props} />
);

export const DeadlineIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={DeadlineSVG} {...props} />
);

export const SortByDownIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={SortByDownSVG} {...props} />
);

export const SettingsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={SettingsSVG} {...props} />
);

export const TownhallLogoWithNameIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={TownhallLogoWithNameSVG} {...props} />
);

export const RequestHouseCardIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={RequestHouseSVG} {...props} />
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

export const MoonbaseIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={MoonbaseSVG} {...props} />
);

export const MoonbeamIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={MoonbeamSVG} {...props} />
);

export const MoonriverIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={MoonriverSVG} {...props} />
);

export const StatemineIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={StatemineSVG} {...props} />
);

export const AcalaIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={AcalaSVG} {...props} />
);

export const AstarIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={AstarSVG} {...props} />
);

export const BifrostIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={BifrostSVG} {...props} />
);

export const CentrifugeIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={CentrifugeSVG} {...props} />
);

export const KaruraIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={KaruraSVG} {...props} />
);

export const KiltIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={KiltSVG} {...props} />
);

export const PendulumIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={PendulumSVG} {...props} />
);

export const SearchIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={SearchSVG} {...props} />
);

export const LoadMoreIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={LoadMoreSVG} {...props} />
);

export const HouseIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={HouseIconSVG} {...props} />
);

export const CancelIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={CancelIconSVG} {...props} />
);

export const ToolTipIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ToolTipIconSVG} {...props} />
);