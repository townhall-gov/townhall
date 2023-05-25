// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GetServerSideProps } from 'next';
import { FC, useEffect } from 'react';
import { IRoom } from '~src/types/schema';
import { getRooms } from 'pages/api/rooms';
import { useDispatch } from 'react-redux';
import Rooms from '~src/components/Houses/Rooms';
import { roomsActions } from '~src/redux/rooms';
import SEOHead from '~src/global/SEOHead';

interface IHouseServerProps {
	rooms: IRoom[] | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IHouseServerProps> = async ({ query }) => {
	const { data: rooms, error } = await getRooms({
		house_id: (query?.house_id? String(query?.house_id): '')
	});
	const props: IHouseServerProps = {
		error: error? error: null,
		rooms: ((rooms && Array.isArray(rooms))? rooms: null)
	};
	return {
		props: props
	};
};

interface IHouseClientProps extends IHouseServerProps {}
const House: FC<IHouseClientProps> = (props) => {
	const { error, rooms } = props;
	const dispatch = useDispatch();
	useEffect(() => {
		if (error) {
			dispatch(roomsActions.setError(error));
		} else if (rooms) {
			dispatch(roomsActions.setRooms(rooms));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error, rooms]);
	return (
		<>
			<SEOHead title='Rooms in a House.' />
			<div className='h-full'>
				<Rooms />
			</div>
		</>
	);
};

export default House;