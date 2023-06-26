// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getHouse } from 'pages/api/house';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import HouseSettings from '~src/components/House/Settings';
import HouseSidebar from '~src/components/House/Sidebar';
import SEOHead from '~src/global/SEOHead';
import { houseActions } from '~src/redux/house';
import { IHouse } from '~src/types/schema';
import BackButton from '~src/ui-components/BackButton';

interface IHouseSettingsServerProps {
    house: IHouse | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IHouseSettingsServerProps> = async ({ query }) => {
	const house_id = (query?.house_id? String(query?.house_id): '');

	const { data: house, error: houseError } = await getHouse({
		house_id
	});

	const props: IHouseSettingsServerProps = {
		error: houseError || null,
		house: house || null
	};

	return {
		props: props
	};
};

interface IHouseSettingsClientProps extends IHouseSettingsServerProps {}

const HouseSettingsPage: FC<IHouseSettingsClientProps> = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;

	useEffect(() => {
		if (props.error) {
			dispatch(houseActions.setError(props.error));
		}

		if (props.house) {
			dispatch(houseActions.setHouse(props.house));
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	return (
		<>
			<SEOHead title={`Settings of House ${query['house_id']}.`} />
			<BackButton className='mb-3' />
			<section className='flex gap-x-[18px]'>
				<HouseSidebar />
				<div className='flex-1 flex flex-col gap-y-[21px]'>
					<HouseSettings />
				</div>
			</section>
		</>
	);
};

export default HouseSettingsPage;