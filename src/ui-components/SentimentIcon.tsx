// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { AgainstIcon, ForIcon, NeutralIcon, SlightlyAgainstIcon, SlightlyForIcon } from './CustomIcons';
import { ESentiment } from '~src/types/enums';

interface ISentimentIconProps {
    type: ESentiment;
    className?: string;
}

const SentimentIcon: FC<ISentimentIconProps> = (props) => {
	switch(props.type) {
	case ESentiment.COMPLETELY_AGAINST:
		return <AgainstIcon className={props.className} />;
	case ESentiment.SLIGHTLY_AGAINST:
		return <SlightlyAgainstIcon className={props.className} />;
	case ESentiment.NEUTRAL:
		return <NeutralIcon className={props.className} />;
	case ESentiment.SLIGHTLY_FOR:
		return <SlightlyForIcon className={props.className} />;
	case ESentiment.COMPLETELY_FOR:
		return <ForIcon className={props.className} />;
	default:
		return null;
	}
};

export default SentimentIcon;