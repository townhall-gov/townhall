// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useEffect, useState } from 'react';
import { IListingDiscussion } from '~src/redux/room/@types';
import DiscussionCard from './DiscussionCard';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Pagination } from 'antd';
import classNames from 'classnames';
import api from '~src/services/api';
import { IDiscussionsQuery } from 'pages/api/discussions';
import { LISTING_LIMIT } from '~src/utils/proposalListingLimit';
import { IDiscussionsCountQuery } from 'pages/api/discussions/count';
import NoProposalsYet from '~src/ui-components/NoProposalsYet';
import { PlusSignSquareIcon } from '~src/ui-components/CustomIcons';

interface IDiscussionsProps {
	discussions: IListingDiscussion[] | null;
	discussionsCount: number;
	house_id: string;
	room_id: string;
	className?: string;
}

const Discussions: FC<IDiscussionsProps> = (props) => {
	const { house_id, room_id, className } = props;
	const [discussions, setDiscussions] = useState<IListingDiscussion[]>([]);
	const [discussionsCount, setDiscussionsCount] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { query } = router;

	useEffect(() => {
		(async () => {
			setLoading(true);
			const { data: count } = await api.get<number, IDiscussionsCountQuery>('discussions/count', {
				house_id: house_id,
				room_id: room_id
			});
			const { data } = await api.get<IListingDiscussion[], IDiscussionsQuery>('discussions', {
				house_id: house_id,
				page: page,
				room_id: room_id
			});
			if (count) {
				setDiscussionsCount(count);
			} else {
				setDiscussionsCount(0);
			}
			if (data) {
				setDiscussions(data);
			}
			setLoading(false);
		})();
	}, [house_id, room_id, router, page]);

	useEffect(() => {
		if (props.discussions && Array.isArray(props.discussions) && props.discussions.length > 0) {
			setDiscussions(props.discussions);
		}
		setDiscussionsCount(props.discussionsCount || 0);
	}, [props]);

	return (
		<section className={classNames('flex flex-col h-full', className)}>
			<button
				disabled={loading}
				onClick={() => {
					router.push(`/${query['house_id']}/${query['room_id']}/discussion/create`);
				}}
				className={classNames('outline-none border border-solid border-blue_primary bg-blue_primary hover:bg-transparent rounded-2xl text-white flex gap-x-1 items-center justify-center px-5 py-2 font-medium text-base ml-auto mb-4', {
					'cursor-not-allowed': loading,
					'cursor-pointer': !loading
				})}
			>
				<PlusSignSquareIcon className='text-2xl text-transparent stroke-white' />
				<span>Create Discussion</span>
			</button>
			<section className='mt-[8.5px]'>
				{
					discussions && Array.isArray(discussions) && discussions.length ?
						<>
							<div className='flex flex-col gap-y-7 h-full pr-2'>
								{
									discussions.map((discussion) => {
										return <DiscussionCard key={discussion.id} discussion={discussion} />;
									})
								}
							</div>
							<article className='flex items-center justify-end'>
								<Pagination
									disabled={loading}
									className='text-white'
									defaultCurrent={1}
									current={page}
									pageSize={LISTING_LIMIT}
									total={discussionsCount}
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

export default styled(Discussions)`
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