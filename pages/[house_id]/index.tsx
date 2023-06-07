// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getRoom } from 'pages/api/room';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import House from '~src/components/House';
import SEOHead from '~src/global/SEOHead';
import { houseActions } from '~src/redux/house';
import { IRoom } from '~src/types/schema';

interface IHouseServerProps {
	room: IRoom | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IHouseServerProps> = async ({ query }) => {
	const { data: room, error } = await getRoom({
		house_id: (query?.house_id? String(query?.house_id): ''),
		room_id: (query?.house_id? String(query?.house_id): '')
	});
	const props: IHouseServerProps = {
		error: error? error: null,
		room: (room? room: null)
	};
	return {
		props: props
	};
};

interface IHouseClientProps extends IHouseServerProps {}
const SingleHouse: FC<IHouseClientProps> = (props) => {
	const router = useRouter();
	const { query } = router;
	const { error, room } = props;
	const dispatch = useDispatch();
	useEffect(() => {
		if (error) {
			dispatch(houseActions.setError(error));
		} else if (room) {
			dispatch(houseActions.setHouseDefaultRoom(room));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error, room]);
	useEffect(() => {
		router.push(`/${query['house_id']}/proposals`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<SEOHead title={`House ${query['house_id']}.`} />
			<div>
				<House />
			</div>
		</>
	);
};

export default SingleHouse;