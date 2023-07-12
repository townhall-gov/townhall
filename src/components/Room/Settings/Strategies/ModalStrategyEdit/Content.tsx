// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import NetworkDropdown from '../NetworkDropdown';
import { useRoomSelector } from '~src/redux/selectors';
import StrategyDropdown from '../StrategyDropdown';
import TokenInfo from '../TokenInfo';
import VotingThreshold from '../VotingThreshold';
import VotingWeight from '../VotingWeight';

const ModalStrategyEditContent = () => {
	const { selectedStrategyTobeEdited } =useRoomSelector();
	if(!selectedStrategyTobeEdited)
		return null;
	return (
		<div>
			<NetworkDropdown strategy={selectedStrategyTobeEdited}/>
			<StrategyDropdown strategy={selectedStrategyTobeEdited}/>
			<TokenInfo strategy={selectedStrategyTobeEdited}/>
			<VotingThreshold strategy={selectedStrategyTobeEdited}/>
			<VotingWeight strategy={selectedStrategyTobeEdited}/>
		</div>
	);
};

export default ModalStrategyEditContent;