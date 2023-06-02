// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useHomeSelector } from '~src/redux/selectors';

const useFilteredHouses = (searchValue: string) => {
	const { houses } = useHomeSelector();

	if (houses && Array.isArray(houses) && houses.length > 0) {
		if (!searchValue) {
			return houses;
		}

		const filteredHouses = houses.filter(house => {
			const lowercaseSearchValue = searchValue.toLowerCase();
			const lowercaseHouseName = house.title.toLowerCase();

			return lowercaseHouseName.includes(lowercaseSearchValue);
		});

		return filteredHouses;
	}

	return [];
};
const useFilteredRooms = (searchValue: string) => {
	const { rooms } = useHomeSelector();

	if (rooms && Array.isArray(rooms) && rooms.length > 0) {
		if (!searchValue) {
			return rooms;
		}

		const filteredRooms = rooms.filter(room => {
			const lowercaseSearchValue = searchValue.toLowerCase();
			const lowercaseHouseName = room.title.toLowerCase();

			return lowercaseHouseName.includes(lowercaseSearchValue);
		});

		return filteredRooms;
	}

	return [];
};
const useFilteredRoomsandHouses = (searchValue: string) => {
	const { rooms } = useHomeSelector();
	const { houses } = useHomeSelector();
	if (rooms && Array.isArray(rooms) && rooms.length > 0) {
		if (!searchValue) {
			// If searchValue is empty, return all houses
			return rooms;
		}

		const filteredRooms = rooms.filter(room => {
			// Filter houses based on searchValue
			const lowercaseSearchValue = searchValue.toLowerCase();
			const lowercaseHouseName = room.title.toLowerCase();

			return lowercaseHouseName.includes(lowercaseSearchValue);
		});
		const filteredHouses = houses.filter(house => {
			// Filter houses based on searchValue
			const lowercaseSearchValue = searchValue.toLowerCase();
			const lowercaseHouseName = house.title.toLowerCase();

			return lowercaseHouseName.includes(lowercaseSearchValue);
		});

		return [...filteredRooms, ...filteredHouses];
	}

	return [];
};

const useCategory = () => {
	const { category } = useHomeSelector();
	return category;
};

export {
	useFilteredHouses,
	useFilteredRooms,
	useFilteredRoomsandHouses,
	useCategory

};