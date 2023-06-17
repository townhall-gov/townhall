// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useEffect } from 'react';
import SEOHead from '~src/global/SEOHead';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { ERoomStage, IListingDiscussion } from '~src/redux/room/@types';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { getDiscussions } from 'pages/api/discussions';
import RoomSidebar from '~src/components/Room/Sidebar';
import RoomAbout from '~src/components/Room/RoomWrapper/RoomAbout';
import Discussions from '~src/components/Room/Discussions';
import { getRoom } from 'pages/api/room';
import { IRoom } from '~src/types/schema';
import { useRoomCurrentStage } from '~src/redux/room/selectors';

interface IDiscussionsServerProps {
	discussions: IListingDiscussion[] | null;
	error: string | null;
	room: IRoom | null;
}

export const getServerSideProps: GetServerSideProps<IDiscussionsServerProps> = async ({ query }) => {
	const house_id = (query?.house_id? String(query?.house_id): '');
	const room_id = (query?.room_id? String(query?.room_id): '');
	const { data, error } = await getDiscussions({
		house_id,
		room_id
	});

	const obj = await getRoom({
		house_id,
		room_id
	});

	const props: IDiscussionsServerProps = {
		discussions: ((data && Array.isArray(data))? (data || []): []),
		error: (error || obj.error || null),
		room: obj.data || null
	};

	return {
		props: props
	};
};

interface IDiscussionsClientProps extends IDiscussionsServerProps {}

const DiscussionsPage: FC<IDiscussionsClientProps> = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const currentStage = useRoomCurrentStage();
	const { query } = router;
	const { discussions, room } = props;

	useEffect(() => {
		if (props.error) {
			dispatch(roomActions.setError(props.error));
		} else if (props.discussions && Array.isArray(props.discussions)) {
			dispatch(roomActions.setDiscussions(props.discussions));
		}
		if (props.room) {
			dispatch(roomActions.setRoom(props.room));
		}
		if (currentStage !== ERoomStage.DISCUSSIONS) {
			dispatch(roomActions.setCurrentStage(ERoomStage.DISCUSSIONS));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	if (!room) {
		return null;
	}

	return (
		<>
			<SEOHead title={`Discussions of Room ${query['room_id']} in House ${query['house_id']}`} />
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
					{
						discussions && Array.isArray(discussions) && discussions.length > 0 && (
							<Discussions discussions={discussions} />
						)
					}
				</div>
			</section>
		</>
	);
};

export default DiscussionsPage;