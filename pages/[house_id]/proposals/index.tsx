// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getHouse } from 'pages/api/house';
import { IHouseRoom, getHouseRooms } from 'pages/api/house/rooms';
import { getProposals } from 'pages/api/proposals';
import { getProposalsCount } from 'pages/api/proposals/count';
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
import { IHouse } from '~src/types/schema';
import BackButton from '~src/ui-components/BackButton';
import { LISTING_LIMIT } from '~src/utils/proposalListingLimit';

interface IProposalsServerProps {
	proposals: IListingProposal[] | null;
	proposalsCount: number | null;
	houseRooms: IHouseRoom[] | null;
    house: IHouse | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IProposalsServerProps> = async ({ query }) => {
	const house_id = (query?.house_id? String(query?.house_id): '');
	const room_id = (query?.house_id? String(query?.house_id): '');

	const { data: proposals, error: proposalsError } = await getProposals({
		house_id,
		limit: LISTING_LIMIT,
		page: 1,
		room_id
	});

	const { data: proposalsCount, error: proposalsCountError } = await getProposalsCount({
		house_id,
		room_id
	});

	const { data: house, error: houseError } = await getHouse({
		house_id
	});

	const { data: houseRooms, error: houseRoomsError } = await getHouseRooms({
		house_id
	});

	const props: IProposalsServerProps = {
		error: proposalsError || houseError || houseRoomsError || proposalsCountError || null,
		house: house || null,
		houseRooms: houseRooms || null,
		proposals: ((proposals && Array.isArray(proposals))? (proposals || []): []),
		proposalsCount: proposalsCount || null
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
	const { houseRooms, proposals, house, proposalsCount } = props;
	const currentStage = useHouseCurrentStage();

	useEffect(() => {
		if (props.error) {
			dispatch(houseActions.setError(props.error));
		}
		if (props.proposals && Array.isArray(props.proposals)) {
			dispatch(houseActions.setProposals(props.proposals));
		}
		if (props.house) {
			dispatch(houseActions.setHouse(props.house));
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
			<BackButton className='mb-3' />
			<section className='flex gap-x-[18px]'>
				<HouseSidebar />
				<div className='flex-1 flex flex-col gap-y-[21px]'>
					<section
						className='flex gap-x-[17.5px]'
					>
						<HouseAbout
							description={house.description}
						/>
						{
							houseRooms && Array.isArray(houseRooms) && houseRooms.length > 0 && (
								<HouseRooms
									houseRooms={houseRooms}
									house_id={house.id}
								/>
							)
						}
					</section>
					<Proposals house_id={house.id} room_id={house.id} proposalsCount={proposalsCount || 0} proposals={proposals} />
				</div>
			</section>
		</>
	);
};

export default HouseProposalsPage;