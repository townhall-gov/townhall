// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getRoom } from 'pages/api/room';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RoomSettings from '~src/components/Room/Settings';
import RoomSidebar from '~src/components/Room/Sidebar';
import SEOHead from '~src/global/SEOHead';
import { roomActions } from '~src/redux/room';
import { ERoomStage } from '~src/redux/room/@types';
import { useRoomCurrentStage } from '~src/redux/room/selectors';
import { useRoomSelector } from '~src/redux/selectors';
import { IRoom } from '~src/types/schema';
import BackButton from '~src/ui-components/BackButton';
import NoRoomFound from '~src/ui-components/NoRoomFound';

interface IRoomSettingsServerProps {
	room: IRoom | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IRoomSettingsServerProps> = async ({ query }) => {
	const house_id = (query?.house_id? String(query?.house_id): '');
	const room_id = (query?.room_id? String(query?.room_id): '');

	const { data: room, error: roomError } = await getRoom({
		house_id,
		room_id
	});

	const props: IRoomSettingsServerProps = {
		error: (roomError || null),
		room: room || null
	};

	return {
		props: props
	};
};

interface IRoomSettingsClientProps extends IRoomSettingsServerProps {}

const RoomSettingsPage: FC<IRoomSettingsClientProps> = (props) => {
	const dispatch = useDispatch();
	const currentStage = useRoomCurrentStage();
	const router = useRouter();
	const { room } = useRoomSelector();
	const { query } = router;

	useEffect(() => {
		if (props.room) {
			dispatch(roomActions.setRoom(props.room));
		}
		if (currentStage !== ERoomStage.SETTINGS) {
			dispatch(roomActions.setCurrentStage(ERoomStage.SETTINGS));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	if (!room) {
		return <NoRoomFound />;
	}

	return (
		<>
			<SEOHead title={`Settings of Room ${query['room_id']} in House ${query['house_id']}`} />
			<BackButton className='mb-3' />
			<section className='flex gap-x-7'>
				<RoomSidebar />
				<RoomSettings />
			</section>
		</>
	);
};

export default RoomSettingsPage;