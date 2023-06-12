// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { IHouseRoom, getHouseRooms } from 'pages/api/house/rooms';
import { getProposals } from 'pages/api/proposals';
import { getRoom } from 'pages/api/room';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import House from '~src/components/House';
import SEOHead from '~src/global/SEOHead';
import { houseActions } from '~src/redux/house';
import { IListingProposal } from '~src/redux/house/@types';
import { IRoom } from '~src/types/schema';

interface IProposalsServerProps {
	proposals: IListingProposal[] | null;
	houseRooms: IHouseRoom[] | null;
	houseRoomsError: string | null;
    houseDefaultRoom: IRoom | null;
    houseDefaultRoomError: string | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IProposalsServerProps> = async ({ query }) => {
	const { filterBy } = query;
	const { data, error } = await getProposals({
		filterBy: String(filterBy),
		house_id: (query?.house_id? String(query?.house_id): ''),
		room_id: (query?.house_id? String(query?.house_id): '')
	});

	const roomRes = await getRoom({
		house_id: (query?.house_id? String(query?.house_id): ''),
		room_id: (query?.house_id? String(query?.house_id): '')
	});

	const houseRoomsRes = await getHouseRooms({
		house_id: (query?.house_id? String(query?.house_id): '')
	});

	const props: IProposalsServerProps = {
		error: (error? error: null),
		houseDefaultRoom: roomRes.data || null,
		houseDefaultRoomError: roomRes.error || null,
		houseRooms: houseRoomsRes.data?.houseRooms || null,
		houseRoomsError: houseRoomsRes.error || null,
		proposals: ((data && Array.isArray(data))? (data || []): [])
	};

	return {
		props: props
	};
};

interface IProposalsClientProps extends IProposalsServerProps {}

const Proposals: FC<IProposalsClientProps> = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;

	useEffect(() => {
		if (props.error) {
			dispatch(houseActions.setError(props.error));
		} else if (props.proposals && Array.isArray(props.proposals)) {
			dispatch(houseActions.setProposals(props.proposals));
		}
		if (props.houseDefaultRoomError) {
			dispatch(houseActions.setError(props.houseDefaultRoomError));
		} else if (props.houseDefaultRoom) {
			dispatch(houseActions.setHouseDefaultRoom(props.houseDefaultRoom));
		}
		if (props.houseRooms) {
			dispatch(houseActions.setHouseRooms(props.houseRooms));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	return (
		<>
			<SEOHead title={`Proposals of Room ${query['house_id']} in House ${query['house_id']}`} />
			<div>
				<House />
			</div>
		</>
	);
};

export default Proposals;