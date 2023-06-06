// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import HouseSidebar from './Sidebar';
import HouseWrapper from './HouseWrapper';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { houseActions } from '~src/redux/house';
import { EHouseStage } from '~src/redux/house/@types';
import { useHouseCurrentStage } from '~src/redux/house/selectors';

const House = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const currentStage = useHouseCurrentStage();
	useEffect(() => {
		const { asPath } = router;
		if (asPath.endsWith('create')) {
			if (currentStage !== EHouseStage.NEW_PROPOSAL) {
				dispatch(houseActions.setCurrentStage(EHouseStage.NEW_PROPOSAL));
			}
		} else if (asPath.endsWith('proposals')) {
			if (currentStage !== EHouseStage.PROPOSALS) {
				dispatch(houseActions.setCurrentStage(EHouseStage.PROPOSALS));
			}
		} else if (asPath.endsWith('settings')) {
			if (currentStage !== EHouseStage.SETTINGS) {
				dispatch(houseActions.setCurrentStage(EHouseStage.SETTINGS));
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<section className='flex gap-x-[18px]'>
			<HouseSidebar />
			<HouseWrapper />
		</section>
	);
};

export default House;