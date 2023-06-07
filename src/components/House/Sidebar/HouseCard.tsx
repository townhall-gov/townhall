// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useRouter } from 'next/router';
import { IHouseQuery } from 'pages/api/house';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import House from '~src/components/Houses/House';
import { houseActions } from '~src/redux/house';
import { useHouseSelector } from '~src/redux/selectors';
import api from '~src/services/api';
import { IHouse } from '~src/types/schema';

const HouseCard = () => {
	const router = useRouter();
	const { house } = useHouseSelector();
	const dispatch = useDispatch();
	useEffect(() => {
		if (!house) {
			(async () => {
				const { query } = router;
				if (!query || !query.house_id) {
					return;
				}
				try {
					// TODO: we need to handle this error
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { data, error } = await api.get<IHouse, IHouseQuery>('house', {
						house_id: String(query.house_id)
					});
					if (data) {
						dispatch(houseActions.setHouse(data));
					}
				} catch (error) {
					// TODO: we need to handle this error
					// console.log(error);
				}
			})();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [house, router]);
	return (
		<>
			{
				house?
					<div>
						<House
							house={house}
						/>
					</div>
					: null
			}
		</>
	);
};

export default HouseCard;