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
	const category=useCategory();
	const { searchQuery } = useHomeSelector();
	if (rooms && Array.isArray(rooms) && rooms.length > 0) {
		if (!searchQuery && category!='all') {
			return rooms;
		}
		if (!searchQuery && category=='all') {
			const sameRoomandHouse = rooms.filter(room => {
				if(room.id!=room.house_id)
					return room;
			});
			return sameRoomandHouse;
		}
		const filteredRooms = rooms.filter(room => {
			const lowercaseSearchValue = searchQuery.toLowerCase();
			const lowercaseHouseName = room.title.toLowerCase();

			return lowercaseHouseName.includes(lowercaseSearchValue);
		});
		if (category!='all') {
			return filteredRooms;
		}
		if (category=='all') {
			const sameRoomandHouse = filteredRooms.filter(room => {
				if(room.id!=room.house_id)
					return room;
			});
			return sameRoomandHouse;
		}

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

const useVisibleHouseCards = () => {
	const { visibleHouseCards  } = useHomeSelector();
	return visibleHouseCards ;
};
const useVisibleRoomCards = () => {
	const { visibleRoomCards  } = useHomeSelector();
	return visibleRoomCards ;
};

export {
	useFilteredHouses,
	useFilteredRooms,
	useCategory,
	useSearchTerm,
	useVisibleHouseCards,
	useVisibleRoomCards

};
