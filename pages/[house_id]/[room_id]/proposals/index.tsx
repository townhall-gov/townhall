// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getProposals } from 'pages/api/proposals';
import { getProposalsCount } from 'pages/api/proposals/count';
import { getRoom } from 'pages/api/room';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Proposals from '~src/components/Room/Proposals';
import RoomAbout from '~src/components/Room/RoomWrapper/RoomAbout';
import RoomSidebar from '~src/components/Room/Sidebar';
import SEOHead from '~src/global/SEOHead';
import { roomActions } from '~src/redux/room';
import { ERoomStage, IListingProposal } from '~src/redux/room/@types';
import { useRoomCurrentStage } from '~src/redux/room/selectors';
import { IRoom } from '~src/types/schema';
import BackButton from '~src/ui-components/BackButton';
import NoRoomFound from '~src/ui-components/NoRoomFound';

interface IProposalsServerProps {
	proposals: IListingProposal[] | null;
	proposalsCount: number | null;
	room: IRoom | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IProposalsServerProps> = async ({ query }) => {
	const house_id = (query?.house_id? String(query?.house_id): '');
	const room_id = (query?.room_id? String(query?.room_id): '');

	const { data: proposals, error: proposalsError } = await getProposals({
		house_id,
		room_id
	});

	const { data: proposalsCount, error: proposalsCountError } = await getProposalsCount({
		house_id,
		room_id
	});

	const { data: room, error: roomError } = await getRoom({
		house_id,
		room_id
	});

	const props: IProposalsServerProps = {
		error: (proposalsError || roomError || proposalsCountError || null),
		proposals: ((proposals && Array.isArray(proposals))? (proposals || []): []),
		proposalsCount: proposalsCount || null,
		room: room || null
	};

	return {
		props: props
	};
};

interface IProposalsClientProps extends IProposalsServerProps {}

const ProposalsPage: FC<IProposalsClientProps> = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const currentStage = useRoomCurrentStage();
	const { query } = router;
	const { proposals, room, proposalsCount } = props;

	useEffect(() => {
		if (props.error) {
			dispatch(roomActions.setError(props.error));
		}
		if (props.proposals && Array.isArray(props.proposals)) {
			dispatch(roomActions.setProposals(props.proposals));
		}
		if (props.room) {
			dispatch(roomActions.setRoom(props.room));
		}
		if (currentStage !== ERoomStage.PROPOSALS) {
			dispatch(roomActions.setCurrentStage(ERoomStage.PROPOSALS));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	if (!room) {
		return <NoRoomFound />;
	}

	return (
		<>
			<SEOHead title={`Proposals of Room ${query['room_id']} in House ${query['house_id']}`} />
			<BackButton className='mb-3' />
			<section className='flex gap-x-7'>
				<RoomSidebar />
				<div className='flex-1 flex flex-col gap-y-[21px]'>
					<section
						className='flex gap-x-[17.5px]'
					>
						<RoomAbout
							description={room.description}
							socials={room.socials}
						/>
					</section>
					<Proposals house_id={room.house_id} room_id={room.id} proposalsCount={proposalsCount || 0} proposals={proposals} />
				</div>
			</section>
		</>
	);
};

export default ProposalsPage;