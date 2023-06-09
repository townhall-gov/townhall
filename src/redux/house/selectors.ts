// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useHouseSelector } from '../selectors';

const useHouseCurrentStage = () => {
	const house = useHouseSelector();
	return house.currentStage;
};

const useHouseSettings = () => {
	const house = useHouseSelector();
	return house.houseSettings;
};

export {
	useHouseCurrentStage,
	useHouseSettings
};