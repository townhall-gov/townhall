// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Action, ThunkAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { authStore } from './auth';
import { modalStore } from './modal';
import { walletStore } from './wallet';
import { createWrapper } from 'next-redux-wrapper';
import { profileStore } from './profile';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { housesStore } from './houses';
import { roomsStore } from './rooms';

export const makeStore = () => {
	const isServer = typeof window === 'undefined';
	const rootReducer = combineReducers({
		[authStore.name]: authStore.reducer,
		[housesStore.name]: housesStore.reducer,
		[modalStore.name]: modalStore.reducer,
		[profileStore.name]: profileStore.reducer,
		[roomsStore.name]: roomsStore.reducer,
		[walletStore.name]: walletStore.reducer
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
			whitelist: [authStore.name, modalStore.name, profileStore.name, walletStore.name] // make sure it does not clash with server keys
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