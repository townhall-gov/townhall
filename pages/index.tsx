// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'dayjs-init';
import { GetServerSideProps } from 'next';
import React, { FC, useCallback, useEffect } from 'react';
import SEOHead from '~src/global/SEOHead';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
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
import { useCategory, useFilteredHouses, useFilteredRooms, useLoadMoreVisibility, useSearchTerm, useVisibleAllCards, useVisibleHouseCards, useVisibleRoomCards } from '~src/redux/home/selector';
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
	const isLoadMoreVisible = useLoadMoreVisibility();
	const visibleAllCards = useVisibleAllCards();
	const visibleHousesCards = useVisibleHouseCards();
	const visibleRoomCards = useVisibleRoomCards();
	const category = useCategory();
	const [isSpinning, setIsSpinning] = React.useState(false);

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

	const handleScroll = useCallback(() => {
		if (isLoadMoreVisible) return;
		const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
		const scrollHeight = document.documentElement.scrollHeight;
		const isAtBottom = ((scrollPosition + 1) >= (scrollHeight ));

		setIsSpinning(false);
		if (isAtBottom) {
			if(category === 'houses') {
				if(visibleHousesCards >= houseFiltered.length) return;
				setIsSpinning(true);
				setTimeout(() => {
					dispatch(homeActions.setLoadMoreHouses());
					setIsSpinning(false);
				}, 1000);
			} else if(category === 'rooms') {
				if(visibleRoomCards >= roomFiltered.length) return;
				setIsSpinning(true);
				setTimeout(() => {
					dispatch(homeActions.setLoadMoreRooms());
					setIsSpinning(false);
				}, 1000);
			} else if(category === 'all') {
				if(visibleAllCards >= (roomFiltered.length + houseFiltered.length)) return;
				setIsSpinning(true);
				setTimeout(() => {
					dispatch(homeActions.setLoadMoreAll());
					setIsSpinning(false);
				}, 1000);
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[category,visibleAllCards,visibleHousesCards,visibleRoomCards]);

	useEffect(() => {
		if (!isLoadMoreVisible) {
			window.addEventListener('scroll', handleScroll);
			return () => {
				window.removeEventListener('scroll', handleScroll);
			};
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadMoreVisible, handleScroll]);

	return (
		<>
			<SEOHead title='Home' desc='Democratizing governance for all blockchains.' />
			<section
				className='h-full flex flex-col gap-y-[42px]'
			>
				<article className='flex gap-x-[18.5px]'>
					<div className='w-full max-w-[538px] flex items-center relative'>
						<SearchIcon className='text-transparent stroke-app_background text-2xl absolute ml-[18px] mr-4' />
						<Input value={useSearchTerm()} onChange={(value: string) => dispatch(homeActions.setSearchQuery(value))} type='text' placeholder='Search' className='search placeholder:text-grey_tertiary font-normal text-xl leading-[24px] pl-12 rounded-[16px] border-2 border-solid  max-h-[62px]'></Input>
					</div>
					<div>
						<SearchCategoryDropdown />
					</div>
				</article>
				<article>
					<section className='flex items-center flex-wrap gap-[50px]'>
						{
							(category == 'houses') && houseFiltered && houseFiltered.slice(0,visibleHousesCards).map((house) => {
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
							(category == 'rooms') && roomFiltered && roomFiltered.slice(0,visibleRoomCards).map((room) => {
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
						{
							(category == 'all') && houseFiltered && houseFiltered.slice(0, visibleAllCards - 5).map((house) => {
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
							(category == 'all') && roomFiltered && roomFiltered.slice(0, visibleAllCards - 5).map((room) => {
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
				</article>

				{
					((category === 'houses' && houseFiltered && houseFiltered.length > 10) ||
					(category === 'rooms' && roomFiltered && roomFiltered.length > 10) ||
					(category === 'all' && houseFiltered && roomFiltered && ((houseFiltered.length + roomFiltered.length) > 10)))?
						<article className={'flex justify-center items-center mt-[100px]'}>
							{
								isLoadMoreVisible?
									<LoadMore
										onClick={() => {
											setIsSpinning(true);
											setTimeout(() => {
												if (category === 'all') {
													dispatch(homeActions.setLoadMoreAll());
												} else if (category === 'houses') {
													dispatch(homeActions.setLoadMoreHouses());
												} else if (category === 'rooms') {
													dispatch(homeActions.setLoadMoreRooms());
												}
												setIsSpinning(false);
											}, 1000);
											dispatch(homeActions.setLoadMoreVisibility(false));
										}}
									/>
									: isSpinning? <Spin indicator={<LoadingOutlined />}/>: null
							}
						</article>
						: null
				}

			</section>
		</>
	);
};

export default Home;