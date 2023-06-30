// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { IHouseSettings } from '~src/redux/house/@types';
import { houseCollection } from '~src/services/firebase/utils';
import { IHouse } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export interface IHouseSettingsBody {
    houseId: string;
    houseSettings: IHouseSettings;
}

export interface IHouseSettingsResponse {
	updatedHouse: IHouse;
}

const handler: TNextApiHandler<IHouseSettingsResponse, IHouseSettingsBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}
	const { houseId, houseSettings } = req.body;

	if (!houseId || typeof houseId !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('house') });
	}

	let address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('token') });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('address') });
	}

	const houseRef = houseCollection.doc(houseId);
	const houseRefDoc = await houseRef.get();

	if (!houseRefDoc || !houseRefDoc.exists || !houseRefDoc.data()) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE_NOT_FOUND('House',houseId) });
	}

	const data = houseRefDoc.data() as IHouse;
	let isUserAdmin = false;
	if (data?.admins && Array.isArray(data?.admins) && data?.admins.length > 0) {
		isUserAdmin = data?.admins.some((admin) => {
			if (admin.addresses && Array.isArray(admin.addresses) && admin.addresses.length > 0) {
				return admin.addresses.some((addr) => addr === address);
			} else {
				return false;
			}
		});
	}

	if (!isUserAdmin) {
		return res.status(StatusCodes.FORBIDDEN).json({ error: messages.ONLY_ACTION_OF_TYPE('admin','house','update') });
	}

	if (houseSettings) {
		const { min_token_to_create_room } = houseSettings;
		const house: IHouse = {
			...data,
			min_token_to_create_room: min_token_to_create_room
		};
		await houseRef.set(house, { merge: true });
		return res.status(StatusCodes.OK).json({
			updatedHouse: house
		});
	}

	res.status(StatusCodes.OK).json({
		updatedHouse: data
	});
};

export default withErrorHandling(handler);