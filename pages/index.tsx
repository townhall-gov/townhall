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
import { useCategory, useFilteredHouses, useFilteredRooms, useSearchTerm } from '~src/redux/home/selector';
import { SearchIcon } from '~src/ui-components/CustomIcons';

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
	const housefiltered = useFilteredHouses();
	const roomfiltered = useFilteredRooms();
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
				className='h-full ml-20'
			>
				<div className='flex'>
					<div className='w-[36rem] mb-12 h-12 flex relative'>
						<SearchIcon className='text-transparent stroke-app_background text-2xl absolute flex border border-black mt-3 ml-4' />
						<Input value={useSearchTerm()} onChange={(value: string) => dispatch(homeActions.setSearchQuery(value))} type='text' placeholder='Search' className='pl-12'></Input>
					</div>
					<div>
						<SearchCategoryDropdown />
					</div>
				</div>

				<section className='flex items-center flex-wrap gap-7'>
					{
						(category == 'houses' || category == 'all') && housefiltered && housefiltered.map((house, index) => {
							return (
								<>
									<House
										key={index}
										{...house}
									/>
								</>
							);
						})
					}
					{
						(category == 'rooms' || category == 'all') && roomfiltered && roomfiltered.map((room, index) => {
							return (
								<>
									<Room
										key={index}
										room={room}
									/>
								</>
							);
						})
					}
				</section>
			</div>
		</>
	);
};

export default Home;