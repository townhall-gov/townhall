// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as jwt from 'jsonwebtoken';

import { JWTPayloadType } from '../types';
import messages from './messages';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import { StatusCodes } from 'http-status-codes';
import { IUser } from '~src/types/schema';

/**
 * Get User from JWT
 */
export default function getUserFromJWT(token: string, publicKey: string | undefined): IUser | null {
	if (!publicKey) {
		throw apiErrorWithStatusCode('JWT keys not set. Aborting.', StatusCodes.FORBIDDEN);
	}

	// verify a token asymmetric - synchronous
	let decoded: JWTPayloadType;
	try {
		decoded = jwt.verify(token, publicKey) as JWTPayloadType;
	} catch (e) {
		throw apiErrorWithStatusCode(messages.INVALID_JWT, StatusCodes.FORBIDDEN);
	}

	if (!decoded.sub) {
		throw apiErrorWithStatusCode(messages.INVALID_ADDRESS_IN_JWT, StatusCodes.FORBIDDEN);
	}
	if (decoded) {
		const user: IUser = {
			address: decoded.address,
			bio: decoded.bio,
			img_url: decoded.img_url,
			joined_houses: decoded.joined_houses || [],
			username: decoded.username || null,
			wallet: decoded.wallet
		};
		return user;
	}
	return null;
}
