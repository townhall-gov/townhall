// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Reaction from './Reaction';
import Divider from '~src/components/Room/Proposals/Divider';
import { EReaction } from '~src/types/enums';

const Reactions = () => {
	return (
		<div className='flex items-center gap-x-[15px]'>
			<Reaction type={EReaction.LIKE} />
			<Divider className='text-blue_primary' />
			<Reaction type={EReaction.DISLIKE} />
		</div>
	);
};

export default Reactions;