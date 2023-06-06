// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { EHouseStage } from '~src/redux/house/@types';
import { useHouseCurrentStage } from '~src/redux/house/selectors';
import HouseSettings from './Settings';
import CreateProposal from '../Room/Proposal/Create';
import Proposals from '../Room/Proposals';
import { useHouseSelector } from '~src/redux/selectors';

const HouseWrapper = () => {
	const currentStage = useHouseCurrentStage();
	const { proposals } = useHouseSelector();

	return (
		<div className='flex-1'>
			{
				(() => {
					switch(currentStage){
					case EHouseStage.PROPOSALS:
						return <Proposals proposals={proposals} />;
					case EHouseStage.NEW_PROPOSAL:
						return <CreateProposal />;
					case EHouseStage.SETTINGS:
						return <HouseSettings />;
					default:
						return null;
					}
				})()
			}
		</div>
	);
};

export default HouseWrapper;