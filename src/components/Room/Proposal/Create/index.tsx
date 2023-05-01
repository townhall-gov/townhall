// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Title from './Title';
import Description from './Description';
import Tags from './Tags';
import Dates from './Dates';
import HideResult from './HideResult';
import { useProfileIsRoomJoined } from '~src/redux/profile/selectors';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Skeleton } from 'antd';

const PreviewBtn = dynamic(() => import('./PreviewBtn'), {
	loading: () => <Skeleton.Avatar active size='large' shape='circle' /> ,
	ssr: false
});

const CreateProposal = () => {
	const { query } = useRouter();
	const isRoomJoined = useProfileIsRoomJoined(String(query.house_id || ''), String(query.room_id || ''));
	return (
		<section className='flex flex-col gap-y-8 h-full'>
			{
				isRoomJoined?
					<>
						<Title />
						<Description imageNamePrefix={`house_${query.house_id}_room_${query?.room_id}_proposal`} />
						<Tags />
						<Dates />
						<HideResult />
						<PreviewBtn />
					</>
					: <p className='text-2xl font-semibold text-green_primary flex items-center justify-center h-full m-0'>
						You need to join the room to create a proposal.
					</p>
			}
		</section>
	);
};

export default CreateProposal;