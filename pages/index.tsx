// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'dayjs-init';
import { GetServerSideProps } from 'next';
import React, { FC, useEffect, useState } from 'react';
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
import RoomandHouseDropdown from '~src/ui-components/RoomandHouseDropdown';
import { useCategory, useFilteredHouses, useFilteredRooms } from '~src/redux/home/selector';
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
	const [searchTerm, setsearrchTerm] = useState('');
	const housefiltered = useFilteredHouses(searchTerm);
	const roomfiltered = useFilteredRooms(searchTerm);
	const category = useCategory();
	useEffect(() => {
		if (rooms && houses) {
			dispatch(homeActions.setHouses(houses));
			dispatch(homeActions.setRooms(rooms));
		}
		if (houses && Array.isArray(houses) && houses.length > 0) {
			dispatch(housesActions.setHouses(houses));
		} else {
			dispatch(housesActions.setHouses([]));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [houses, rooms, searchTerm]);
	useEffect(() => {
		dispatch(homeActions.setCategory('All'));
	}, []);
	return (
		<>
			<SEOHead title='Home' desc='Democratizing governance for all blockchains.' />
			<div className='w-1/2 mb-2 flex'>
				<Input value={searchTerm} onChange={(value: string) => setsearrchTerm(value)} type='text' placeholder='Search'></Input>
				<RoomandHouseDropdown className='p-4' />
			</div>

			<div
				className='h-full'
			>
				<section className='flex items-center flex-wrap gap-7'>
					{
						(category == 'Houses' || category == 'All') && housefiltered && housefiltered.map((house, index) => {
							if (housefiltered.includes(house)) {
								return (
									<>
										<House
											key={index}
											{...house}
										/>
									</>
								);
							}
						})
					}
					{
						(category == 'Rooms' || category == 'All') && roomfiltered && roomfiltered.map((room, index) => {
							if (roomfiltered.includes(room)) {
								return (
									<>
										<Room
											key={index}
											room={room}
										/>
									</>
								);
							}
						})
					}
				</section>
			</div>
		</>
	);
};

export default Home;