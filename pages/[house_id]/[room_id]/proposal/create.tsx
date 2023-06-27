// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getRoom } from 'pages/api/room';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CreateProposal from '~src/components/Room/Proposal/Create';
import RoomSidebar from '~src/components/Room/Sidebar';
import SEOHead from '~src/global/SEOHead';
import { roomActions } from '~src/redux/room';
import { ERoomStage } from '~src/redux/room/@types';
import { useRoomCurrentStage } from '~src/redux/room/selectors';
import { useRoomSelector } from '~src/redux/selectors';
import { IRoom } from '~src/types/schema';
import BackButton from '~src/ui-components/BackButton';
import NoRoomFound from '~src/ui-components/NoRoomFound';

interface ICreateProposalPageServerProps {
	error: string | null;
	room: IRoom | null;
}

export const getServerSideProps: GetServerSideProps<ICreateProposalPageServerProps> = async ({ query }) => {
	const house_id = (query?.house_id? String(query?.house_id): '');
	const room_id = (query?.room_id? String(query?.room_id): '');

	const { error, data } = await getRoom({
		house_id,
		room_id
	});

	const props: ICreateProposalPageServerProps = {
		error: error || null,
		room: data || null
	};

	return {
		props: props
	};
};

interface ICreateProposalPageClientProps extends ICreateProposalPageServerProps {}

const CreateProposalPage: FC<ICreateProposalPageClientProps> = (props) => {
	const dispatch = useDispatch();
	const currentStage = useRoomCurrentStage();
	const router = useRouter();
	const { room } = useRoomSelector();
	const { query } = router;

	useEffect(() => {
		if (props.error) {
			dispatch(roomActions.setError(props.error));
		}
		if (props.room) {
			dispatch(roomActions.setRoom(props.room));
		}
		if (currentStage !== ERoomStage.NEW_PROPOSAL) {
			dispatch(roomActions.setCurrentStage(ERoomStage.NEW_PROPOSAL));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	if (!room) {
		return <NoRoomFound />;
	}

	return (
		<>
			<SEOHead title={`Create a Proposal in Room ${query['room_id']} of House ${query['house_id']}`} />
			<BackButton url={`/${query['house_id']}/proposals`} className='mb-3' />
			<section className='flex gap-x-7'>
				<RoomSidebar />
				<CreateProposal />
			</section>
		</>
	);
};

export default CreateProposalPage;