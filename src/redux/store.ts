// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Action, ThunkAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { modalStore } from './modal';
import { walletStore } from './wallet';
import { createWrapper } from 'next-redux-wrapper';
import { profileStore } from './profile';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { housesStore } from './houses';
import { roomsStore } from './rooms';
import { notificationStore } from './notification';
import { roomStore } from './room';
import { proposalStore } from './proposal';
import { editorStore } from './editor';
import { homeStore } from './home';
import { houseStore } from './house';

export const makeStore = () => {
	const isServer = typeof window === 'undefined';
	const rootReducer = combineReducers({
		[housesStore.name]: housesStore.reducer,
		[modalStore.name]: modalStore.reducer,
		[notificationStore.name]: notificationStore.reducer,
		[profileStore.name]: profileStore.reducer,
		[proposalStore.name]: proposalStore.reducer,
		[houseStore.name]: houseStore.reducer,
		[roomStore.name]: roomStore.reducer,
		[roomsStore.name]: roomsStore.reducer,
		[walletStore.name]: walletStore.reducer,
		[editorStore.name]: editorStore.reducer,
		[homeStore.name]:homeStore.reducer
	});

	if (isServer) {
		const store = configureStore({
			devTools: true,
			middleware: (getDefaultMiddleware) =>
				getDefaultMiddleware({
					immutableCheck: false,
					serializableCheck: false
				}),
			reducer: rootReducer
		});
		return store;
	} else {
	// we need it only on client side
		const persistConfig = {
			key: 'townhall',
			storage,
			whitelist: [modalStore.name, profileStore.name, walletStore.name, housesStore.name] // make sure it does not clash with server keys
		};
		const persistedReducer = persistReducer(persistConfig, rootReducer);
		const store: any = configureStore({
			devTools: process.env.NODE_ENV !== 'production',
			middleware: (getDefaultMiddleware) =>
				getDefaultMiddleware({
					immutableCheck: false,
					serializableCheck: {
						ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
					}
				}),
			reducer: persistedReducer
		});
		store.__persistor = persistStore(store); // Nasty hack
		return store;
	}
};

export type TAppStore = ReturnType<typeof makeStore>;
export type TAppState = ReturnType<TAppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  TAppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<TAppStore>(makeStore);