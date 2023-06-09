// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getProposals } from 'pages/api/proposals';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Room from '~src/components/Room';
import SEOHead from '~src/global/SEOHead';
import { roomActions } from '~src/redux/room';
import { IListingProposal } from '~src/redux/room/@types';

interface IProposalsServerProps {
	proposals: IListingProposal[] | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IProposalsServerProps> = async ({ query }) => {
	const { filterBy } = query;
	const { data, error } = await getProposals({
		filterBy: String(filterBy),
		house_id: (query?.house_id? String(query?.house_id): ''),
		room_id: (query?.room_id? String(query?.room_id): '')
	});

	const props: IProposalsServerProps = {
		error: (error? error: null),
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
			dispatch(roomActions.setError(props.error));
		} else if (props.proposals && Array.isArray(props.proposals)) {
			dispatch(roomActions.setProposals(props.proposals));
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

export default Proposals;