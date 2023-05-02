// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import jwt from 'jsonwebtoken';
import { EWallet } from '~src/types/enums';
import { verifyMetamaskSignature } from './utils/verifyMetamaskSignature';
import verifySignature from './utils/verifySignature';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import messages from './utils/messages';
import { userCollection } from '~src/services/firebase/utils';
import { IJoinedHouse, IUser } from '~src/types/schema';
import { IToken, JWTPayloadType } from './types';
import { StatusCodes } from 'http-status-codes';
import Web3 from 'web3';
import getUserFromJWT from './utils/getUserFromJWT';
import { getJoinedRooms } from 'pages/api/auth/data/joined-rooms';

// JWT globals
process.env.JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY && process.env.JWT_PRIVATE_KEY.replace(/\\n/gm, '\n');
process.env.JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY && process.env.JWT_PUBLIC_KEY.replace(/\\n/gm, '\n');

const privateKey = process.env.NODE_ENV === 'test' ? process.env.JWT_PRIVATE_KEY_TEST : process.env.JWT_PRIVATE_KEY?.replace(/\\n/gm, '\n');
const jwtPublicKey = process.env.NODE_ENV === 'test' ? process.env.JWT_PUBLIC_KEY_TEST : process.env.JWT_PUBLIC_KEY?.replace(/\\n/gm, '\n');
const passphrase = process.env.NODE_ENV === 'test' ? process.env.JWT_KEY_PASSPHRASE_TEST : process.env.JWT_KEY_PASSPHRASE;

class AuthService {
	public async GetUser(token: string): Promise<IUser | null> {
		const user = getUserFromJWT(token, jwtPublicKey);
		return user;
	}
	private async getSignMessage(address: string): Promise<string> {
		// TODO: randomString = uuidv4()
		const randomString = 'random';
		const signMessage = address.startsWith('0x')? `Login in townhall ${randomString}`: `<Bytes>${randomString}</Bytes>`;
		return signMessage;
	}
	private async getSignedToken(user: IUser): Promise<string> {
		if (!privateKey) {
			throw apiErrorWithStatusCode('JWT keys not set. Aborting.', StatusCodes.FORBIDDEN);
		}

		if (!passphrase) {
			throw apiErrorWithStatusCode('JWT keys not set. Aborting.', StatusCodes.FORBIDDEN);
		}

		const tokenContent: JWTPayloadType = {
			...user,
			iat: Math.floor(Date.now() / 1000),
			sub: `${user.address}`
		};

		return jwt.sign(
			tokenContent,
			{ key: privateKey, passphrase },
			{ algorithm: 'RS256', expiresIn: '30d' }
		);
	}
	public async Connect(address: string, wallet: EWallet, signature: string): Promise<IToken> {
		const signMessage = await this.getSignMessage(address);

		const isValidStr = Web3.utils.isAddress(address) ? verifyMetamaskSignature(signMessage, address, signature) : verifySignature(signMessage, address, signature);
		if (!isValidStr) throw apiErrorWithStatusCode(messages.ADDRESS_LOGIN_INVALID_SIGNATURE, StatusCodes.UNAUTHORIZED);

		const user: IUser = {
			address: address,
			bio: null,
			img_url: null,
			joined_houses: [],
			username: null,
			wallet: wallet
		};

		const userDocRef = userCollection.doc(address);
		const userDocSnapshot = await userDocRef.get();
		let joined_houses: IJoinedHouse[] = [];
		if (userDocSnapshot && userDocSnapshot.exists) {
			const data = userDocSnapshot.data();
			if (data) {
				if (data.bio && typeof data.bio === 'string') {
					user.bio = data.bio;
				}
				if (data.img_url && typeof data.img_url === 'string') {
					user.img_url = data.img_url;
				}
				if (data.username && typeof data.username === 'string') {
					user.username = data.username;
				}
				try {
					const { data, error } = await getJoinedRooms({ address: user.address });
					if (data) {
						joined_houses = data;
					} else {
						// TODO: better error handling
						console.log(error);
					}
				} catch (error) {
					// TODO: better error handling
					console.log(error);
				}
			}
		} else {
			await userDocRef.set(user, { merge: true });
		}
		return {
			joined_houses,
			token: await this.getSignedToken(user)
		};
	}
	public async ConnectWalletStart(address: string): Promise<string> {
		const signMessage = await this.getSignMessage(address);
		// TODO: storing signMessage in redis
		return signMessage;
	}
}

const authServiceInstance = new AuthService();
export default authServiceInstance;