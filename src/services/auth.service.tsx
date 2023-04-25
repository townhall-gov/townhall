// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { decodeToken } from 'react-jwt';

import { JWTPayloadType } from '~src/auth/types';
import { IUser } from '~src/types/schema';

/**
 * Store the JWT token in localstorage
 * @param token the token received from the authentication header
 */
export const storeLocalStorageToken = (token: string) => {
	if(typeof window !== 'undefined'){
		localStorage.setItem('Authorization', token);
	}
};

/**
 * Get the the jwt from localstorage
 * if any. It might be expired
 */
export const getLocalStorageToken = (): string | null => {
	if(typeof window !== 'undefined'){
		return localStorage.getItem('Authorization') || null;
	}

	return null;
};

/**
 * Remove the the jwt from localstorage
 * if any.
 */
export const deleteLocalStorageToken = (): void => {
	if(typeof window !== 'undefined'){
		return localStorage.removeItem('Authorization');
	}
};

/**
 * Store the user information in local context and call the function to store the received token
 * @param token answered by the auth server
 * @param currentUser context data on the user
 */
export const getUserFromToken = (token: string): IUser | null => {
	token && storeLocalStorageToken(token);
	try {
		const tokenPayload: any = token && decodeToken<JWTPayloadType>(token);

		if (tokenPayload && tokenPayload.sub) {
			const {
				address,
				bio,
				img_url,
				joined_houses,
				username,
				wallet
			} = tokenPayload as JWTPayloadType;

			return {
				address,
				bio,
				img_url,
				joined_houses,
				username,
				wallet
			};
		}
	} catch (error) {
		console.error(error);
	}
	return null;
};

