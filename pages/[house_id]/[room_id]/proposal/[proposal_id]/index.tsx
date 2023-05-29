// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getProposal } from 'pages/api/proposal';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProposalWrapper from '~src/components/Room/Proposal';
import SEOHead from '~src/global/SEOHead';
import { proposalActions } from '~src/redux/proposal';
import { IProposal } from '~src/types/schema';

interface IProposalServerProps {
	proposal: IProposal | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IProposalServerProps> = async ({ query }) => {
	const { data, error } = await getProposal({
		house_id: (query?.house_id? String(query?.house_id): ''),
		proposal_id: (query?.proposal_id? Number(query?.proposal_id): 0),
		room_id: (query?.room_id? String(query?.room_id): '')
	});

	const props: IProposalServerProps = {
		error: (error? error: null),
		proposal: (data? data: null)
	};

	return {
		props: props
	};
};

interface IProposalClientProps extends IProposalServerProps {}

const Proposal: FC<IProposalClientProps> = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;

	useEffect(() => {
		if (props.error) {
			dispatch(proposalActions.setError(props.error));
		} else if (props.proposal) {
			dispatch(proposalActions.setProposal(props.proposal));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	return (
		<>
			<SEOHead title={`This is a Proposal in Room ${query['room_id']} of House ${query['house_id']}.`} />
			<div>
				<ProposalWrapper />
			</div>
		</>
	);
};

export default Proposal;