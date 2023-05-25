// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ERoomCreationStage, ESocial, IRoomCreation } from './@types';

const roomCreationValidation = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	[ERoomCreationStage.GETTING_STARTED]: (roomCreation: IRoomCreation) => {
		return '';
	},
	[ERoomCreationStage.CREATOR_DETAILS]: (roomCreation: IRoomCreation) => {
		let error = '';
		if (roomCreation) {
			if (roomCreation.creator_details) {
				if (!roomCreation.creator_details.name) {
					error = 'Creator name is required.';
				}
				if (!roomCreation.creator_details.email) {
					error = 'Creator email is required.';
				} else {
					// eslint-disable-next-line no-useless-escape
					const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
					if (!re.test(roomCreation.creator_details.email)) {
						error = 'Invalid email format.';
					}
				}
				if (!roomCreation.creator_details.phone) {
					error = 'Creator phone is required.';
				}
			} else {
				error = 'Creator details are required.';
			}
		}
		return error;
	},
	[ERoomCreationStage.ROOM_DETAILS]: (roomCreation: IRoomCreation) => {
		let error = '';
		if (roomCreation) {
			if (roomCreation.room_details) {
				if (!roomCreation.room_details?.name) {
					error =  'Room name is required.';
				} else if (!roomCreation.room_details?.title) {
					error =  'Room title is required.';
				} else if (!roomCreation.room_details?.description) {
					error =  'Room description is required.';
				} else if (!roomCreation.room_details?.logo) {
					error =  'Room logo is required.';
				}
			} else {
				error =  'Room details is required.';
			}
		}
		return error;
	},
	[ERoomCreationStage.ROOM_STRATEGIES]: (roomCreation: IRoomCreation) => {
		let error = '';
		if (roomCreation) {
			if (roomCreation.room_strategies && Array.isArray(roomCreation.room_strategies)) {
				if (roomCreation.room_strategies.length === 0) {
					error = 'At least one room strategy is required.';
				}
			} else {
				error =  'Room strategies is required.';
			}
		}
		return error;
	},
	[ERoomCreationStage.ROOM_SOCIALS]: (roomCreation: IRoomCreation) => {
		let error = '';
		if (roomCreation) {
			if (roomCreation.room_socials && Array.isArray(roomCreation.room_socials)) {
				roomCreation.room_socials.forEach((social) => {
					if (social && social.url && social.type) {
						if (!Object.values(ESocial).includes(social.type)) {
							error = `${social.type} is not a valid social type.`;
						}
					} else {
						error = 'Empty room social.';
					}
				});
			} else {
				error = 'Room socials is required.';
			}
		}
		return error;
	},
	[ERoomCreationStage.SELECT_HOUSE]: (roomCreation: IRoomCreation) => {
		let error = '';
		if (roomCreation && !roomCreation.select_house) {
			error = 'House is required.';
		}
		return error;
	}
};

export default roomCreationValidation;