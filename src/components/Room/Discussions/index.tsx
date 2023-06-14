// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { IListingDiscussion } from '~src/redux/room/@types';
import NoProposalsYet from '~src/ui-components/NoProposalsYet';
import DiscussionCard from './DiscussionCard';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface IDiscussionsProps {
	discussions: IListingDiscussion[];
}

const Discussions: FC<IDiscussionsProps> = (props) => {
	const { discussions } = props;
	const router = useRouter();
	const { query } = router;
	return (
		<section className='flex flex-col h-full'>
			<Link
				href={`/${query['house_id']}/${query['room_id']}/discussion/create`}
				className='outline-none border border-solid border-blue_primary bg-blue_primary hover:bg-transparent rounded-2xl text-white flex flex-col items-center justify-center px-5 py-2 font-medium text-base cursor-pointer ml-auto mb-4'
			>
				Create Discussion
			</Link>
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
					</>
					: <NoProposalsYet />
			}

		</section>
	);
};

export default Discussions;