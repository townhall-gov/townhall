// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from 'dayjs';
import { IProposalCreation } from './@types';

const proposalCreationValidation = {
	description: (description?: string | null) => {
		let error = '';
		if (!description || typeof description !== 'string') {
			error = 'Description is required.';
		} else if (description.length < 25) {
			error = 'Description should be at least 25 characters long.';
		}
		// TODO: html xss validation
		return error;
	},
	end_date: (start_date?: string | null, end_date?: string | null) => {
		let error = proposalCreationValidation.start_date(start_date);
		if (error) return error;
		if (!end_date) {
			error = 'End date is required.';
		} else if (!dayjs(end_date).isValid()) {
			error = 'End date is not valid.';
		} else {
			const endDate = dayjs(end_date);
			const startDate = dayjs(start_date);
			const now = dayjs();
			if (endDate.isBefore(now)) {
				error = 'End date should be in the future.';
			} else if (endDate.isBefore(startDate)) {
				error = 'End date should be after start date.';
			}
		}
		return error;
	},
	preparation_period: (start_date?: string | null, end_date?: string | null, preparation_period?: string | null) => {
		let error = proposalCreationValidation.start_date(start_date);
		if (error) return error;
		error = proposalCreationValidation.end_date(start_date, end_date);
		if (error) return error;
		if (!preparation_period) {
			error = 'Preparation period date is required.';
		} else if (!dayjs(preparation_period).isValid()) {
			error = 'Preparation period date is not valid.';
		} else {
			const endDate = dayjs(end_date);
			const startDate = dayjs(start_date);
			const preparationPeriodDate = dayjs(preparation_period);
			const now = dayjs();
			if (preparationPeriodDate.isBefore(now)) {
				error = 'Preparation period date should be in the future.';
			} else if (preparationPeriodDate.isBefore(startDate)) {
				error = 'Preparation period date should be after start date.';
			} else if (preparationPeriodDate.isAfter(endDate)) {
				error = 'Preparation period date should be before end date.';
			}
		}
		return error;
	},
	start_date: (start_date?: string | null) => {
		let error = '';
		if (!start_date){
			error = 'Start date is required.';
		} else if (!dayjs(start_date).isValid()) {
			error = 'Start date is not valid.';
		} else if (dayjs(start_date).isBefore(dayjs())) {
			error = 'Start date should be in the future.';
		}
		return error;
	},
	tags: (tags?: string[] | null) => {
		const errors: {
            key: string;
            error: string;
        }[] = [];
		if (tags && Array.isArray(tags)) {
			tags.forEach((tag) => {
				if (typeof tag !== 'string') {
					errors.push({
						error: `Tag "${tag}" is not a valid tag.`,
						key: tag
					});
				} else if (tag.length < 3) {
					errors.push({
						error: `Tag "${tag}" should be at least 3 characters long.`,
						key: tag
					});
				} else if (tag.length > 15) {
					errors.push({
						error: `Tag "${tag}" should be less than 15 characters long.`,
						key: tag
					});
				}
			});
		}
		return errors;
	},
	title: (title?: string | null) => {
		let error = '';
		if (!title || typeof title !== 'string') {
			error = 'Title is required.';
		} else if (title.length < 5) {
			error = 'Title should be at least 5 characters long.';
		} else if (title.length > 100) {
			error = 'Title should be less than 100 characters long.';
		}
		return error;
	},
	validate: (proposalCreation: IProposalCreation, isErrorFieldHighlight?: boolean) => {
		const errorFields: {
            fieldKey: string;
            error: string | ({
                key: string;
                error: string;
            }[]);
        }[]= [];
		Object.entries(proposalCreation).forEach(([key, value]) => {
			switch(key) {
			case 'description': {
				const error = proposalCreationValidation.description(value as string);
				if (error) {
					errorFields.push({
						error,
						fieldKey: 'description'
					});
				}
			}
				break;
			case 'title': {
				const error = proposalCreationValidation.title(value as string);
				if (error) {
					errorFields.push({
						error,
						fieldKey: 'title'
					});
				}
			}
				break;
			case 'start_date': {
				const error = proposalCreationValidation.start_date(value as string);
				if (error) {
					errorFields.push({
						error,
						fieldKey: 'start_date'
					});
				}
			}
				break;
			case 'end_date': {
				const error = proposalCreationValidation.end_date(proposalCreation.start_date, value as string);
				if (error) {
					errorFields.push({
						error,
						fieldKey: 'end_date'
					});
				}
			}
				break;
			case 'preparation_period': {
				const error = proposalCreationValidation.preparation_period(proposalCreation.start_date, proposalCreation.end_date, value as string);
				if (error) {
					errorFields.push({
						error,
						fieldKey: 'preparation_period'
					});
				}
			}
				break;
			case 'tags': {
				const error = proposalCreationValidation.tags(value as string[]);
				if (error) {
					errorFields.push({
						error,
						fieldKey: 'tags'
					});
				}
			}
				break;
			}
		});
		const removeClass = 'border-blue_primary';
		const applyClass = 'proposal_error';
		if (errorFields.length > 0 && isErrorFieldHighlight) {
			errorFields.forEach((errorField) => {
				if (errorField) {
					const { error, fieldKey } = errorField;
					if (fieldKey === 'tags') {
						if (error && Array.isArray(error)) {
							error.forEach((tagError) => {
								errorFieldHighlight({
									applyClass,
									className: `tags-${tagError.key}`,
									removeClass
								});
							});
						}
					} else if (fieldKey === 'description') {
						errorFieldHighlight({
							applyClass,
							childClassName: 'tox-tinymce',
							className: 'description',
							removeClass
						});
					} else {
						errorFieldHighlight({
							applyClass,
							className: fieldKey,
							removeClass
						});
					}
				}
			});
		}
		return errorFields;
	}
};

export const errorFieldHighlight = (params: {
    className: string;
    childClassName?: string;
    removeClass: string;
    applyClass: string;
}) => {
	const { className, removeClass, applyClass, childClassName } = params;
	const errorFields = document.getElementsByClassName(className);
	if (errorFields && errorFields.length > 0) {
		const errorField = errorFields[0] as HTMLElement;
		if (errorField) {
			if (childClassName) {
				const childErrorFields = errorField.getElementsByClassName(childClassName);
				if (childErrorFields && childErrorFields.length > 0) {
					const childErrorField = childErrorFields[0] as HTMLElement;
					if (childErrorField) {
						childErrorField.classList.remove(removeClass);
						childErrorField.classList.add(applyClass);
					}
				}
			} else {
				errorField.classList.remove(removeClass);
				errorField.classList.add(applyClass);
			}
		}
	}
};

export const removeErrorFieldHighlight = (targetClass: string, applyClass: string) => {
	const elements = document.getElementsByClassName(targetClass);
	for (const elm of elements) {
		elm.classList.remove(targetClass);
		elm.classList.add(applyClass);
	}
};

export default proposalCreationValidation;