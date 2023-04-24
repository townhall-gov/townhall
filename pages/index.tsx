// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GetServerSideProps } from 'next';
import { FC, useEffect } from 'react';
import { IHouse } from '~src/types/schema';
import { getHouses } from './api/houses';
import Houses from '~src/components/Houses';
import { useDispatch } from 'react-redux';
import { housesActions } from '~src/redux/houses';

interface IHomeServerProps {
	houses: IHouse[] | null;
	error: string | null;
}

export const getServerSideProps: GetServerSideProps<IHomeServerProps> = async () => {
	const { data: houses, error } = await getHouses();
	const props: IHomeServerProps = {
		error: error? error: null,
		houses: ((houses && Array.isArray(houses))? houses: null)
	};
	return {
		props: props
	};
};

interface IHomeClientProps extends IHomeServerProps {}
const Home: FC<IHomeClientProps> = (props) => {
	const { error, houses } = props;
	const dispatch = useDispatch();
	useEffect(() => {
		if (error) {
			dispatch(housesActions.setError(error));
		} else if (houses) {
			dispatch(housesActions.setHouses(houses));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error, houses]);
	return (
		<div>
			<Houses />
		</div>
	);
};

export default Home;