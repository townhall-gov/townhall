// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getDiscussion } from 'pages/api/discussion';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DiscussionWrapper from '~src/components/Room/Discussion';
import SEOHead from '~src/global/SEOHead';
import { discussionActions } from '~src/redux/discussion';
import { IDiscussion } from '~src/types/schema';
import BackButton from '~src/ui-components/BackButton';

interface IDiscussionServerProps {
	discussion: IDiscussion | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IDiscussionServerProps> = async ({ query }) => {
	const { data, error } = await getDiscussion({
		discussion_id: Number(query?.discussion_id),
		house_id: (query?.house_id? String(query?.house_id): ''),
		room_id: (query?.room_id? String(query?.room_id): '')
	});

	const props: IDiscussionServerProps = {
		discussion: (data? data: null),
		error: (error? error: null)
	};

	return {
		props: props
	};
};

interface IDiscussionClientProps extends IDiscussionServerProps {}

const Discussion: FC<IDiscussionClientProps> = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;

	useEffect(() => {
		if (props.error) {
			dispatch(discussionActions.setError(props.error));
		} else if (props.discussion) {
			dispatch(discussionActions.setDiscussion(props.discussion));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	return (
		<>
			<SEOHead title={`This is a Discussion in Room ${query['room_id']} of House ${query['house_id']}.`} />
			<div className='flex flex-col gap-y-[20.27px] items-start'>
				<BackButton />
				<DiscussionWrapper />
			</div>
		</>
	);
};

export default Discussion;