// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { DiscordIcon, GithubIcon, RedditIcon, TwitterIcon } from './CustomIcons';
import { ESocial } from '~src/redux/rooms/@types';
import { TelegramIcon } from './CustomIcons';

interface ISocialIconProps {
    type: ESocial;
    className?: string;
}

const SocialIcon: FC<ISocialIconProps> = (props) => {
	switch(props.type) {
	case ESocial.DISCORD:
		return <DiscordIcon className={props.className} />;
	case ESocial.GITHUB:
		return <GithubIcon className={props.className} />;
	case ESocial.REDDIT:
		return <RedditIcon className={props.className} />;
	case ESocial.TELEGRAM:
		return <TelegramIcon className={props.className} />;
	case ESocial.TWITTER:
		return <TwitterIcon className={props.className} />;
	default:
		return null;
	}
};

export default SocialIcon;