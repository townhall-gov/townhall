// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GetServerSideProps } from 'next';
import { getHouses } from 'pages/api/houses';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RoomCreate from '~src/components/RoomCreate';
import SEOHead from '~src/global/SEOHead';
import { housesActions } from '~src/redux/houses';
import { IHouse } from '~src/types/schema';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IRoomCreationServerProps {
	error?: string | null;
	houses?: IHouse[] | null;
}
interface IRoomCreationClientProps extends IRoomCreationServerProps {}

export const getServerSideProps: GetServerSideProps<IRoomCreationServerProps> = async () => {
	return {
		props: {},
		redirect: {
			destination: '/'
		}
	};
	const { data: houses, error } = await getHouses();
	const props: IRoomCreationServerProps = {
		error: error? error: null,
		houses: ((houses && Array.isArray(houses))? houses: null)
	};
	return {
		props: props
	};
};

const RoomCreation: FC<IRoomCreationClientProps> = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {
		const { houses, error } = props;
		if (error) {
			dispatch(housesActions.setError(getErrorMessage(error)));
		} else if (!houses) {
			dispatch(housesActions.setError('Something went wrong.'));
		} else {
			dispatch(housesActions.setHouses(houses));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);
	return (
		<>
			<SEOHead title='Create a Room in a House.' />
			<div className='h-full'>
				<RoomCreate />
			</div>
		</>
	);
};

export default RoomCreation;