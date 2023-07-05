// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { getHouseRooms } from 'pages/api/house/rooms';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SEOHead from '~src/global/SEOHead';
import { IHouse, IRoom } from '~src/types/schema';
import { houseActions } from '~src/redux/house';
import { useRouter } from 'next/router';
import { getHouse } from 'pages/api/house';
import Rooms from '~src/components/House/Rooms';
import BackButton from '~src/ui-components/BackButton';
import HouseSidebar from '~src/components/House/Sidebar';
import HouseAbout from '~src/components/House/HouseWrapper/HouseAbout';

interface IHouseRoomsServerProps {
	rooms: IRoom[] | null;
    house: IHouse | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IHouseRoomsServerProps> = async ({ query }) => {
	const house_id = (query?.house_id? String(query?.house_id): '');
	const { data: rooms, error: roomError } = await getHouseRooms({
		house_id: house_id
	});
	const { data: house, error: houseError } = await getHouse({
		house_id
	});
	const props: IHouseRoomsServerProps = {
		error: roomError || houseError || null,
		house: house || null,
		rooms: ((rooms && Array.isArray(rooms))? rooms: null)
	};
	return {
		props: props
	};
};

interface IHouseRoomsClientProps extends IHouseRoomsServerProps {}
const HouseRooms: FC<IHouseRoomsClientProps> = (props) => {
	const { error, rooms, house } = props;
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;
	useEffect(() => {
		if (error) {
			dispatch(houseActions.setError(error));
		}
		if (rooms) {
			dispatch(houseActions.setHouseRooms(rooms));
		}
		if (house) {
			dispatch(houseActions.setHouse(house));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error, rooms, house]);

	if (!house) {
		return null;
	}

	return (
		<>
			<SEOHead title={`House ${query['house_id']} Rooms.`} />
			<BackButton url={`/${query['house_id']}/proposals`} className='mb-3' />
			<section className='flex gap-x-[18px]'>
				<HouseSidebar />
				<div className='flex-1 flex flex-col gap-y-[21px]'>
					<section className='flex'>
						<HouseAbout
							description={house.description}
						/>
					</section>
					<Rooms />
				</div>
			</section>
		</>
	);
};

export default HouseRooms;