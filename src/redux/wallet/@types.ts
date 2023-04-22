// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EWallet } from '~src/types/enums';

export type TWalletsAddresses = {
    [key in EWallet]: string[];
}

export type TSelectedAddress = string | null;

export interface IWalletStore {
    selectedWallet: EWallet | null;
    selectedAddress: TSelectedAddress;
    walletsAddresses: TWalletsAddresses;
    error: string | null;
    loading: boolean;
}