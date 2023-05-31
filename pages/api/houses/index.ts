// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { houseCollection, roomCollection } from '~src/services/firebase/utils';
import { EBlockchain } from '~src/types/enums';
import { IHouse, IRoom } from '~src/types/schema';
import getErrorMessage from '~src/utils/getErrorMessage';

export type TGetHousesFn = () => Promise<TApiResponse<IHouse[]>>;
export const getHouses: TGetHousesFn = async () => {
	try {
		const houses: IHouse[] = [];
		const housesSnapshot = await houseCollection.get();
		if (housesSnapshot.size > 0) {
			const housesPromise = housesSnapshot.docs.map(async (doc) => {
				if (doc && doc.exists) {
					const data = doc.data() as IHouse;
					if (data) {
						// Sanitization
						if (data.id && data.blockchain && Object.values(EBlockchain).includes(data.blockchain)) {
							let total_members = 0;
							const roomsQuerySnapshot = await roomCollection(data.id).get();
							roomsQuerySnapshot.docs.forEach((roomDoc) => {
								if (roomDoc && roomDoc.exists) {
									const data = roomDoc.data() as IRoom;
									if (data && data.total_members) {
										total_members += data.total_members;
									}
								}
							});

							const house: IHouse = {
								blockchain: data.blockchain,
								description: data.description || '',
								id: data.id,
								is_erc20: data.is_erc20 || false,
								logo: data.logo,
								networks: data.networks || [],
								title: data.title || '',
								total_members: Number(total_members || 0)
							};
							return house;
						}
					}
				}
			});
			const housesPromiseSettledResult = await Promise.allSettled(housesPromise);
			housesPromiseSettledResult.forEach((result) => {
				if (result && result.status === 'fulfilled') {
					const house = result.value;
					if (house) {
						houses.push(house);
					}
				}
			});
		}
		return {
			data: JSON.parse(JSON.stringify(houses)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: StatusCodes.INTERNAL_SERVER_ERROR
		};
	}
};

export interface IHousesBody {}
export interface IHousesQuery {}
const handler: TNextApiHandler<IHouse[], IHousesBody, IHousesQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}

	const {
		data: houses,
		error,
		status
	} = await getHouses();

	if (houses && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(houses);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler);