// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IJoinedHouse, IUser } from '~src/types/schema';

interface IToken {
    token: string;
    joined_houses: IJoinedHouse[];
}

interface JWTPayloadType extends IUser {
    iat: number;
    sub: string;
}

export {
	IToken,
	JWTPayloadType
};