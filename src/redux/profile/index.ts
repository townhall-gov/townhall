// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IProfileStore } from './@types';
import { IJoinedHouse, IJoinedRoom, IUser } from '~src/types/schema';

const initialState: IProfileStore = {
	joinOrRemoveHouseIds: [],
	joinOrRemoveRoomIds: [],
	user: null
};

export const profileStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate profile', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.profile
			};
		});
	},
	initialState,
	name: 'profile',
	reducers: {
		addJoinedRoom: (state, action: PayloadAction<{
			houseId: string;
			joinedRoom: IJoinedRoom;
		}>) => {
			if (state.user) {
				const { houseId, joinedRoom } = action.payload;
				if (state.user.joined_houses && Array.isArray(state.user.joined_houses) && state.user.joined_houses.length > 0) {
					if (state.user.joined_houses.find((joinedHouse) => joinedHouse.house_id === houseId)) {
						state.user.joined_houses = [...state.user.joined_houses.map((joinedHouse) => {
							if (joinedHouse.house_id === houseId) {
								return {
									...joinedHouse,
									joined_rooms: [...joinedHouse.joined_rooms, joinedRoom]
								};
							}
							return {
								...joinedHouse
							};
						})];
					} else {
						state.user.joined_houses = [
							...state.user.joined_houses,
							{
								house_id: houseId,
								joined_rooms: [joinedRoom]
							}
						];
					}
				} else {
					state.user.joined_houses = [
						{
							house_id: houseId,
							joined_rooms: [joinedRoom]
						}
					];
				}
			}
		},
		addJoinedRooms: (state, action: PayloadAction<IJoinedHouse[]>) => {
			if (state.user) {
				state.user.joined_houses = action.payload;
			}
		},
		joinHouse: (state, action: PayloadAction<string>) => {
			if (!state.joinOrRemoveHouseIds.includes(action.payload)) {
				state.joinOrRemoveHouseIds = [...state.joinOrRemoveHouseIds, action.payload];
			}
		},
		joinRoom: (state, action: PayloadAction<string>) => {
			if (!state.joinOrRemoveRoomIds.includes(action.payload)) {
				state.joinOrRemoveRoomIds = [...state.joinOrRemoveRoomIds, action.payload];
			}
		},
		removeHouse: (state, action: PayloadAction<string>) => {
			state.joinOrRemoveHouseIds = state.joinOrRemoveHouseIds.filter((id) => id !== action.payload);
		},
		removeJoinedRoom: (state, action: PayloadAction<{
			houseId: string;
			roomId: string;
		}>) => {
			if (state.user) {
				const { houseId, roomId } = action.payload;
				if (state.user.joined_houses && Array.isArray(state.user.joined_houses)) {
					const joined_houses = state.user.joined_houses.map((joinedHouse) => {
						if (joinedHouse.house_id === houseId) {
							const joined_rooms = ((joinedHouse?.joined_rooms && Array.isArray(joinedHouse.joined_rooms))? joinedHouse.joined_rooms: []);
							joinedHouse.joined_rooms = [...joined_rooms.filter((room) => room.id !== roomId)];
						}
						return {
							...joinedHouse
						};
					}) || [];
					state.user.joined_houses = [...joined_houses.filter((joinedHouse) => {
						if (joinedHouse && joinedHouse.joined_rooms.length === 0) {
							return false;
						}
						return true;
					})];
				} else {
					state.user.joined_houses = [];
				}
			}
		},
		removeRoom: (state, action: PayloadAction<string>) => {
			state.joinOrRemoveRoomIds = state.joinOrRemoveRoomIds.filter((id) => id !== action.payload);
		},
		setUser: (state, action: PayloadAction<IUser | null>) => {
			state.user = action.payload;
		}
	}
});

export default profileStore.reducer;
const profileActions = profileStore.actions;
export {
	profileActions
};