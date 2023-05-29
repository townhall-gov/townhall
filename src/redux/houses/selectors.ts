// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useHousesSelector } from '../selectors';

const useSelectedHouse = (house_id: string) => {
	const { houses } = useHousesSelector();
	if (houses && Array.isArray(houses) && houses.length > 0) {
		return houses.find((house) => house.id === house_id);
	}
};

export {
	useSelectedHouse
};