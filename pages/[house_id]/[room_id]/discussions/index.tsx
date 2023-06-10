// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useEffect } from 'react';
import SEOHead from '~src/global/SEOHead';
import Room from '~src/components/Room';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { IListingDiscussion } from '~src/redux/room/@types';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { getDiscussions } from 'pages/api/discussions';

interface IDiscussionsServerProps {
	discussions: IListingDiscussion[] | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IDiscussionsServerProps> = async ({ query }) => {
	const { data, error } = await getDiscussions({
		house_id: (query?.house_id? String(query?.house_id): ''),
		room_id: (query?.room_id? String(query?.room_id): '')
	});

	const props: IDiscussionsServerProps = {
		discussions: ((data && Array.isArray(data))? (data || []): []),
		error: (error? error: null)
	};

	return {
		props: props
	};
};

interface IDiscussionsClientProps extends IDiscussionsServerProps {}

const Discussions: FC<IDiscussionsClientProps> = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;

	useEffect(() => {
		if (props.error) {
			dispatch(roomActions.setError(props.error));
		} else if (props.discussions && Array.isArray(props.discussions)) {
			dispatch(roomActions.setDiscussions(props.discussions));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);
	return (
		<>
			<SEOHead title={`Proposals of Room ${query['room_id']} in House ${query['house_id']}`} />
			<div>
				<Room />
			</div>
		</>
	);
};

export default Discussions;