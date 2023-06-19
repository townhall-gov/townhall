// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ERoomCreationStage, ESocial, IRoomCreation } from './@types';

export interface IRoomCreationError {
	[key: string]: string;
}

export const removeError = (id: string) => {
	const element = document.getElementById(id);
	if (element) {
		element.textContent = '';
		element.classList.add('hidden');
	}
};

export const addError = (id: string, msg: string) => {
	const element = document.getElementById(id);
	if (element) {
		element.textContent = `*${msg}`;
		element.classList.remove('hidden');
	}
};

const roomCreationValidation = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	[ERoomCreationStage.GETTING_STARTED]: (roomCreation: IRoomCreation) => {
		return {} as IRoomCreationError;
	},
	[ERoomCreationStage.CREATOR_DETAILS]: (roomCreation: IRoomCreation) => {
		const errors: IRoomCreationError = {};
		if (roomCreation) {
			if (roomCreation.creator_details) {
				if (!roomCreation.creator_details.name) {
					errors['creator_details_name'] = 'Creator name is required.';
				}
				if (!roomCreation.creator_details.email) {
					errors['creator_details_email'] = 'Creator email is required.';
				} else {
					// eslint-disable-next-line no-useless-escape
					const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
					if (!re.test(roomCreation.creator_details.email)) {
						errors['creator_details_email'] = 'Invalid email format.';
					}
				}
				if (!roomCreation.creator_details.phone) {
					errors['creator_details_phone'] = 'Creator phone is required.';
				}
			} else {
				errors['creator_details_name'] = 'Creator name is required.';
				errors['creator_details_email'] = 'Creator email is required.';
				errors['creator_details_phone'] = 'Creator phone is required.';
			}
		}
		return errors;
	},
	[ERoomCreationStage.ROOM_DETAILS]: (roomCreation: IRoomCreation) => {
		const errors: IRoomCreationError = {};
		if (roomCreation) {
			if (roomCreation.room_details) {
				if (!roomCreation.room_details?.name) {
					errors['room_details_name'] = 'Room name is required.';
				}
				if(!roomCreation.room_details?.title) {
					errors['room_details_title'] = 'Room title is required.';
				}
				if (!roomCreation.room_details?.description) {
					errors['room_details_description'] = 'Room description is required.';
				}
				if (!roomCreation.room_details?.contract_address) {
					errors['room_details_contract_address'] = 'Room contract address is required.';
				}
				if (!roomCreation.room_details?.logo) {
					errors['room_details_logo'] = 'Room logo is required.';
				}
			} else {
				errors['room_details_name'] = 'Room name is required.';
				errors['room_details_title'] = 'Room title is required.';
				errors['room_details_description'] = 'Room description is required.';
				errors['room_details_contract_address'] = 'Room contract address is required.';
				errors['room_details_logo'] = 'Room logo is required.';
			}
		}
		return errors;
	},
	[ERoomCreationStage.ROOM_STRATEGIES]: (roomCreation: IRoomCreation) => {
		const errors: IRoomCreationError = {};
		if (roomCreation) {
			if (roomCreation.room_strategies && Array.isArray(roomCreation.room_strategies)) {
				if (roomCreation.room_strategies.length === 0) {
					errors['room_strategies'] = 'At least one room strategy is required.';
				}
			} else {
				errors['room_strategies'] = 'Room strategies is required.';
			}
		}
		return errors;
	},
	[ERoomCreationStage.ROOM_SOCIALS]: (roomCreation: IRoomCreation) => {
		const errors: IRoomCreationError = {};
		if (roomCreation) {
			if (roomCreation.room_socials && Array.isArray(roomCreation.room_socials)) {
				roomCreation.room_socials.forEach((social) => {
					if (social && social.type && Object.values(ESocial).includes(social.type)) {
						if (!social.url) {
							errors[`room_socials_${social.type}`] = `${social.type} url is not a valid url.`;
						}
					} else {
						errors['room_socials'] = 'Room social is invalid.';
					}
				});
			} else {
				errors['room_socials'] = 'Room social is required.';
			}
		}
		return errors;
	},
	[ERoomCreationStage.SELECT_HOUSE]: (roomCreation: IRoomCreation) => {
		const errors: IRoomCreationError = {};
		if (roomCreation && !roomCreation.select_house) {
			errors['select_house'] = 'House is required.';
		}
		return errors;
	}
};

export default roomCreationValidation;