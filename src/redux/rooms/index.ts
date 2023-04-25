// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { ERoomCreationStage, IRoomsStore } from './@types';
import { IHouse, IRoom } from '~src/types/schema';

const initialState: IRoomsStore = {
	error: null,
	joinOrRemoveRoom: null,
	roomCreation: {
		creator_details: null,
		currentStage: ERoomCreationStage.GETTING_STARTED,
		getting_started: null,
		project_details: null,
		project_socials: null,
		select_house: null
	},
	rooms: []
};

interface IUpdateRoomPayloadType {
	roomId: string;
	room: IRoom;
}

export const roomsStore = createSlice({
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			console.log('hydrate rooms', (action as PayloadAction<any>).payload);
			return {
				...state,
				...(action as PayloadAction<any>).payload.rooms
			};
		});
	},
	initialState,
	name: 'rooms',
	reducers: {
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setJoinOrRemoveRoom: (state, action: PayloadAction<string | null>) => {
			state.joinOrRemoveRoom = action.payload;
		},
		setRoomCreationStage: (state, action: PayloadAction<ERoomCreationStage>) => {
			if (state.roomCreation) {
				state.roomCreation.currentStage = action.payload;
			} else {
				state.roomCreation = {
					creator_details: null,
					currentStage: action.payload,
					getting_started: null,
					project_details: null,
					project_socials: null,
					select_house: null
				};
			}
		},
		setRoomCreation_House: (state, action: PayloadAction<IHouse | undefined>) => {
			const house = action.payload || null;
			if (state.roomCreation) {
				state.roomCreation.select_house = house;
			} else {
				state.roomCreation = {
					creator_details: null,
					currentStage: ERoomCreationStage.SELECT_HOUSE,
					getting_started: null,
					project_details: null,
					project_socials: null,
					select_house: house
				};
			}
		},
		setRooms: (state, action: PayloadAction<IRoom[]>) => {
			state.rooms = action.payload;
		},
		updateRoom: (state, action: PayloadAction<IUpdateRoomPayloadType>) => {
			const { room: updatedRoom, roomId } = action.payload;
			state.rooms = [...state.rooms.map((room) => {
				if (room.id === roomId) {
					return {
						...updatedRoom
					};
				}
				return {
					...room
				};
			})];
		}
	}
});

export default roomsStore.reducer;
const roomsActions = roomsStore.actions;
export {
	roomsActions
};