// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useSelector } from 'react-redux';
import { TAppState } from './store';
import { IModalStore } from './modal/@types';
import { IAuthStore } from './auth/@types';
import { IWalletStore } from './wallet/@types';
import { IProfileStore } from './profile/@types';
import { IHousesStore } from './houses/@types';
import { IRoomsStore } from './rooms/@types';

const useModalSelector = () => {
	return useSelector<TAppState, IModalStore>((state) => state.modal);
};

const useAuthSelector = () => {
	return useSelector<TAppState, IAuthStore>((state) => state.modal);
};

const useWalletSelector = () => {
	return useSelector<TAppState, IWalletStore>((state) => state.wallet);
};

const useProfileSelector = () => {
	return useSelector<TAppState, IProfileStore>((state) => state.profile);
};

const useHousesSelector = () => {
	return useSelector<TAppState, IHousesStore>((state) => state.houses);
};

const useRoomsSelector = () => {
	return useSelector<TAppState, IRoomsStore>((state) => state.rooms);
};

export {
	useAuthSelector,
	useModalSelector,
	useWalletSelector,
	useProfileSelector,
	useHousesSelector,
	useRoomsSelector
};