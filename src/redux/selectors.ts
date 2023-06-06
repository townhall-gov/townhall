// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useSelector } from 'react-redux';
import { TAppState } from './store';
import { IModalStore } from './modal/@types';
import { IWalletStore } from './wallet/@types';
import { IProfileStore } from './profile/@types';
import { IHousesStore } from './houses/@types';
import { IRoomsStore } from './rooms/@types';
import { IRoomStore } from './room/@types';
import { IProposalStore } from './proposal/@types';
import { IEditorStore } from './editor/@types';
import { IHomeStore } from './home/@types';

const useModalSelector = () => {
	return useSelector<TAppState, IModalStore>((state) => state.modal);
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

const useRoomSelector = () => {
	return useSelector<TAppState, IRoomStore>((state) => state.room);
};

const useRoomsSelector = () => {
	return useSelector<TAppState, IRoomsStore>((state) => state.rooms);
};

const useProposalSelector = () => {
	return useSelector<TAppState, IProposalStore>((state) => state.proposal);
};

const useEditorSelector = () => {
	return useSelector<TAppState, IEditorStore>((state) => state.editor);
};

const useHomeSelector = () => {
	return useSelector<TAppState, IHomeStore>((state) => state.home);
};

export {
	useModalSelector,
	useWalletSelector,
	useProfileSelector,
	useHousesSelector,
	useRoomSelector,
	useRoomsSelector,
	useProposalSelector,
	useEditorSelector,
	useHomeSelector
};