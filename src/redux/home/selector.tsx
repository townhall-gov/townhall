// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useHomeSelector } from '~src/redux/selectors';

const useFilteredHouses = () => {
	const { houses } = useHomeSelector();
	const { searchQuery } = useHomeSelector();

	if (houses && Array.isArray(houses) && houses.length > 0) {
		const lowercaseSearchValue = (searchQuery || '').toLowerCase();
		return houses.filter((house) => (house.title || '').toLowerCase().includes(lowercaseSearchValue));
	}

	return [];
};
const useFilteredRooms = () => {
	const { rooms } = useHomeSelector();
	const category = useCategory();
	const { searchQuery } = useHomeSelector();

	if (rooms && Array.isArray(rooms) && rooms.length > 0) {
		const lowercaseSearchValue = (searchQuery || '').toLowerCase();
		return rooms.filter((room) => (category === 'all'? room.id !== room.house_id: true) && (room.title || '').toLowerCase().includes(lowercaseSearchValue));
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
	const { visibleHouseCards } = useHomeSelector();
	return visibleHouseCards ;
};

const useVisibleRoomCards = () => {
	const { visibleRoomCards } = useHomeSelector();
	return visibleRoomCards ;
};

const useVisibleAllCards = () => {
	const { visibleAllCards } = useHomeSelector();
	console.log(visibleAllCards);
	return visibleAllCards ;
};

const useLoadMoreVisibility = () => {
	const { isLoadMoreVisible } = useHomeSelector();
	return isLoadMoreVisible ;
};

export {
	useFilteredHouses,
	useFilteredRooms,
	useCategory,
	useSearchTerm,
	useVisibleHouseCards,
	useVisibleRoomCards,
	useLoadMoreVisibility,
	useVisibleAllCards

};
