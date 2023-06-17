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
import HouseAbout from '~src/components/House/HouseWrapper/HouseAbout';
import HouseRooms from '~src/components/House/HouseWrapper/HouseRooms';
import HouseSidebar from '~src/components/House/Sidebar';
import Proposals from '~src/components/Room/Proposals';
import SEOHead from '~src/global/SEOHead';
import { houseActions } from '~src/redux/house';
import { EHouseStage, IListingProposal } from '~src/redux/house/@types';
import { useHouseCurrentStage } from '~src/redux/house/selectors';
import { useHouseSelector } from '~src/redux/selectors';
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

const HouseProposalsPage: FC<IProposalsClientProps> = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;
	const { houseRooms, proposals } = props;
	const { house } = useHouseSelector();
	const currentStage = useHouseCurrentStage();

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

	useEffect(() => {
		if (currentStage !== EHouseStage.PROPOSALS) {
			dispatch(houseActions.setCurrentStage(EHouseStage.PROPOSALS));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!house) {
		return null;
	}

	return (
		<>
			<SEOHead title={`Proposals of Room ${query['house_id']} in House ${query['house_id']}`} />
			<section className='flex gap-x-[18px]'>
				<HouseSidebar />
				<div className='flex-1 flex flex-col gap-y-[21px]'>
					<section
						className='flex gap-x-[17.5px]'
					>
						<HouseAbout
							description={house.description}
						/>
						<HouseRooms
							houseRooms={houseRooms}
							house_id={house.id}
						/>
					</section>
					<Proposals proposals={proposals} />
				</div>
			</section>
		</>
	);
};

export default HouseProposalsPage;