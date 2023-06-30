// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'dayjs-init';
import { GetServerSideProps } from 'next';
import React, { FC, useEffect } from 'react';
import SEOHead from '~src/global/SEOHead';
import { IHouse, IRoom } from '~src/types/schema';
import { getHouses } from './api/houses';
import { getRooms } from './api/rooms';
import { useDispatch } from 'react-redux';
import { housesActions } from '~src/redux/houses';
import Room from '~src/components/Houses/Rooms/Room';
import House from '~src/components/Houses/House';
import Input from '~src/ui-components/Input';
import { homeActions } from '~src/redux/home';
import SearchCategoryDropdown from '~src/ui-components/SearchCategoryDropdown';
import { useCategory, useFilteredHouses, useFilteredRooms, useSearchTerm, useVisibleHouseCards, useVisibleRoomCards } from '~src/redux/home/selector';
import { SearchIcon } from '~src/ui-components/CustomIcons';
import LoadMore from '~src/ui-components/LoadMore';

interface IHomeServerProps {
	houses: IHouse[] | null;
	error: string | null;
	rooms: IRoom[] | null;
}

export const getServerSideProps: GetServerSideProps<IHomeServerProps> = async () => {
	const { data: houses, error } = await getHouses();
	const rooms: IRoom[] = [];
	if (houses && Array.isArray(houses) && houses.length > 0) {
		const roomPromises = houses.map(async (house) => {
			if (house.id) {
				const { data } = await getRooms({
					house_id: house.id
				});
				if (data && Array.isArray(data) && data.length > 0) {
					return data;
				}
			}
		});
		const promiseSettledResults = await Promise.allSettled(roomPromises);
		promiseSettledResults.forEach((result) => {
			if (result.status === 'fulfilled' && result.value && Array.isArray(result.value) && result.value.length > 0) {
				rooms.push(...result.value);
			}
		});
	}
	const props: IHomeServerProps = {
		error: error ? error : null,
		houses: ((houses && Array.isArray(houses)) ? houses : null),
		rooms: rooms
	};
	return {
		props: props
	};
};

interface IHomeClientProps extends IHomeServerProps { }
const Home: FC<IHomeClientProps> = (props) => {
	const { houses, rooms } = props;
	const dispatch = useDispatch();
	const houseFiltered = useFilteredHouses();
	const roomFiltered = useFilteredRooms();
	const visibleHousesCards=useVisibleHouseCards();
	const visibleRoomCards=useVisibleRoomCards();
	const category = useCategory();
	useEffect(() => {
		if (rooms) {
			dispatch(homeActions.setRooms(rooms));
		}
		if (houses) {
			dispatch(homeActions.setHouses(houses));
		}
		if (houses && Array.isArray(houses) && houses.length > 0) {
			dispatch(housesActions.setHouses(houses));
		} else {
			dispatch(housesActions.setHouses([]));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [houses, rooms]);
	return (
		<>
			<SEOHead title='Home' desc='Democratizing governance for all blockchains.' />
			<div
				className='h-full flex flex-col gap-y-[42px]'
			>
				<div className='flex gap-x-[18.5px]'>
					<div className='w-full max-w-[538px] flex items-center relative'>
						<SearchIcon className='text-transparent stroke-app_background text-2xl absolute ml-[18px] mr-4' />
						<Input value={useSearchTerm()} onChange={(value: string) => dispatch(homeActions.setSearchQuery(value))} type='text' placeholder='Search' className='search placeholder:text-grey_tertiary font-normal text-xl leading-[24px] pl-12 rounded-[16px] border-2 border-solid  max-h-[62px]'></Input>
					</div>
					<div>
						<SearchCategoryDropdown />
					</div>
				</div>

				<div>
					<section className='flex items-center flex-wrap gap-[50px]'>
						{
							(category == 'houses' || category == 'all') && houseFiltered && houseFiltered.slice(0,visibleHousesCards).map((house) => {
								return (
									<>
										<House
											key={house.id}
											house={house}
										/>
									</>
								);
							})
						}
						{
							(category == 'rooms' || category == 'all') && roomFiltered && roomFiltered.slice(0,visibleRoomCards).map((room) => {
								return (
									<>
										<Room
											key={room.id}
											room={room}
										/>
									</>
								);
							})
						}
					</section>
				</div>
				{category === 'all' && (
					<div className={`flex justify-center items-center mt-[58px] ${(visibleHousesCards+visibleRoomCards) >= (houseFiltered?.length+roomFiltered.length) ? 'hidden' : ''}`} onClick={() => {
						dispatch(homeActions.setLoadMoreHouses());
						dispatch(homeActions.setLoadMoreRooms());
					}}>
						<LoadMore />
					</div>
				)}

				{category === 'houses' && (
					<div className={`flex justify-center items-center mt-[58px] ${visibleHousesCards >= houseFiltered?.length ? 'hidden' : ''}`} onClick={() => dispatch(homeActions.setLoadMoreHouses())}>
						<LoadMore />
					</div>
				)}

				{category === 'rooms' && (
					<div className={`flex justify-center items-center mt-[58px] ${visibleRoomCards >= roomFiltered.length ? 'hidden' : ''}`} onClick={() => dispatch(homeActions.setLoadMoreRooms())}>
						<LoadMore />
					</div>
				)}
			</div>
		</>
	);
};

export default Home;