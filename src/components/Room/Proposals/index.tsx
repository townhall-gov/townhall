// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LoadingOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useState } from 'react';
import ProposalCard from './ProposalCard';
import { IListingProposal } from '~src/redux/room/@types';
import Filter from './Filter';
import NoProposalsYet from '~src/ui-components/NoProposalsYet';
import api from '~src/services/api';
import { IProposalsQuery } from 'pages/api/proposals';
import { useRouter } from 'next/router';
import { Pagination, Spin } from 'antd';
import styled from 'styled-components';
import classNames from 'classnames';
import { LISTING_LIMIT } from '~src/utils/proposalListingLimit';
import { IProposalsCountQuery } from 'pages/api/proposals/count';

interface IProposalsProps {
	proposals: IListingProposal[] | null;
	proposalsCount: number;
	house_id: string;
	room_id: string;
	className?: string;
}

const Proposals: FC<IProposalsProps> = (props) => {
	const { house_id, room_id, className } = props;
	const [proposals, setProposals] = useState<IListingProposal[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [proposalsCount, setProposalsCount] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [option, setOption] = useState('');
	const router = useRouter();

	useEffect(() => {
		(async () => {
			if (option) {
				setLoading(true);
				const { data: count } = await api.get<number, IProposalsCountQuery>('proposals/count', {
					filter_by: option,
					house_id: house_id,
					room_id: room_id
				});
				const { data } = await api.get<IListingProposal[], IProposalsQuery>('proposals', {
					filter_by: option,
					house_id: house_id,
					page: page,
					room_id: room_id
				});
				if (count) {
					setProposalsCount(count);
				} else {
					setProposalsCount(0);
				}
				if (data) {
					setProposals(data);
				}
				setLoading(false);
			}
		})();
	}, [house_id, option, room_id, router, page]);

	useEffect(() => {
		if (props.proposals && Array.isArray(props.proposals) && props.proposals.length > 0) {
			setProposals(props.proposals);
		}
		setProposalsCount(props.proposalsCount || 0);
		setOption('all');
	}, [props]);

	return (
		<section className={classNames('flex flex-col h-full', className)}>
			<div
				className='flex items-center justify-end mb-[8.5px]'
			>
				<Spin wrapperClassName='rounded-2xl' className='rounded-2xl w-[125px]' spinning={loading} indicator={<LoadingOutlined />}>
					<Filter loading={loading} option={option} setOption={setOption} />
				</Spin>
			</div>
			<section>
				{
					proposals && Array.isArray(proposals) && proposals.length ?
						<>
							<div className='flex flex-col gap-y-7 h-full pr-2'>
								{
									proposals.map((proposal) => {
										return <ProposalCard key={proposal.id} proposal={proposal} />;
									})
								}
							</div>
							<article className='flex items-center justify-end'>
								<Pagination
									className='text-white'
									defaultCurrent={1}
									current={page}
									pageSize={LISTING_LIMIT}
									total={proposalsCount}
									showSizeChanger={false}
									hideOnSinglePage={true}
									onChange={(page) => setPage(page)}
									responsive={true}
								/>
							</article>
						</>
						: <NoProposalsYet />
				}
			</section>
		</section>
	);
};

export default styled(Proposals)`
	.ant-spin-container {
		background-color: var(--app_background) !important;
		border-radius: 16px !important;
		opacity: 1 !important;
		overflow: hidden !important;
	}
	.ant-pagination-prev button {
		color: var(--blue_primary) !important;
	}
	.ant-pagination-item a {
		color: var(--blue_primary) !important;
	}
	.ant-pagination-item-active {
		background-color: var(--blue_primary) !important;
	}
	.ant-pagination-item-active a {
		color: white !important;
	}
	.ant-pagination-next button {
		color: var(--blue_primary) !important;
	}
`;