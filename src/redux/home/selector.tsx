// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useHomeSelector } from '~src/redux/selectors';

const useFilteredHouses = () => {
	const { houses } = useHomeSelector();
	const { searchQuery } = useHomeSelector();

	if (houses && Array.isArray(houses) && houses.length > 0) {
		if (!searchQuery) {
			return houses;
		}

		const filteredHouses = houses.filter(house => {
			const lowercaseSearchValue = searchQuery.toLowerCase();
			const lowercaseHouseName = house.title.toLowerCase();

			return lowercaseHouseName.includes(lowercaseSearchValue);
		});

		return filteredHouses;
	}

	return [];
};
const useFilteredRooms = () => {
	const { rooms } = useHomeSelector();
	const { searchQuery } = useHomeSelector();
	if (rooms && Array.isArray(rooms) && rooms.length > 0) {
		if (!searchQuery) {
			return rooms;
		}

		const filteredRooms = rooms.filter(room => {
			const lowercaseSearchValue = searchQuery.toLowerCase();
			const lowercaseHouseName = room.title.toLowerCase();

			return lowercaseHouseName.includes(lowercaseSearchValue);
		});

		return filteredRooms;
	}

	return [];
};

const useCategory = () => {
	const { category } = useHomeSelector();
	return category;
};

const useSearchTerm = () => {
	const { searchQuery } = useHomeSelector();
	return searchQuery;
};

export {
	useFilteredHouses,
	useFilteredRooms,
	useCategory,
	useSearchTerm

};