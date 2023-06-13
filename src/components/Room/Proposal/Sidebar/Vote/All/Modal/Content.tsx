// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LoadingOutlined } from '@ant-design/icons';
import { Divider, Spin } from 'antd';
import { IVotesInfoQuery } from 'pages/api/votes';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { useProposalSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { IVote } from '~src/types/schema';
import Vote from './Vote';

const AllVotesModalContent = () => {
	const { proposal, votes } = useProposalSelector();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			if (!proposal) return;
			setLoading(true);
			const res = await api.get<IVote[], IVotesInfoQuery>('votes', {
				house_id: proposal.house_id,
				proposal_id: proposal.id,
				room_id: proposal.room_id
			});
			if (res.data) {
				dispatch(proposalActions.setVotes(res.data));
			}
			setLoading(false);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [proposal]);

	return (
		<section
			className='flex flex-col gap-y-3 py-3'
		>
			<Spin
				className='bg-app_background'
				spinning={loading}
				indicator={<LoadingOutlined />}
			>
				<div
					className='flex flex-col gap-y-3'
				>
					<article
						className='grid grid-cols-3 gap-x-2 text-base font-medium'
					>
						<p
							className='m-0'
						>
                            Voter
						</p>
						<p
							className='m-0 flex items-center justify-center'
						>
                            Amount
						</p>
						<p
							className='m-0 flex items-center justify-center'
						>
                            Vote
						</p>
					</article>
					<Divider className='bg-blue_primary m-0 mb-2' />
					{
						votes.map((vote) => {
							return (
								<Vote
									key={vote.id}
									vote={vote}
								/>
							);
						})
					}
				</div>
			</Spin>
		</section>
	);
};

export default AllVotesModalContent;