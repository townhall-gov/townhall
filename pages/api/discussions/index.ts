// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { IListingDiscussion } from '~src/redux/room/@types';
import { discussionCollection } from '~src/services/firebase/utils';
import { EReaction } from '~src/types/enums';
import { IDiscussion } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';
import { LISTING_LIMIT } from '~src/utils/proposalListingLimit';

interface IGetDiscussionsFnParams {
    house_id: string;
    room_id: string;
	page?: number;
	limit?: number;
}

export type TGetDiscussionsFn = (params: IGetDiscussionsFnParams) => Promise<TApiResponse<IListingDiscussion[]>>;
export const getDiscussions: TGetDiscussionsFn = async (params) => {
	try {
		const { house_id, room_id, page, limit } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('house'), StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('room'), StatusCodes.BAD_REQUEST);
		}
		if (page) {
			const numPage = Number(page);
			if (isNaN(numPage) || numPage < 0) {
				throw apiErrorWithStatusCode(messages.INVALID_TYPE('Invalid page.'), StatusCodes.BAD_REQUEST);
			}
		}
		if (limit) {
			const numLimit = Number(limit);
			if (isNaN(numLimit) || numLimit < 0) {
				throw apiErrorWithStatusCode(messages.INVALID_TYPE('Invalid limit.'), StatusCodes.BAD_REQUEST);
			}
		}
		const discussions: IListingDiscussion[] = [];
		let discussionsQuery = discussionCollection(house_id, room_id).orderBy('created_at', 'desc');

		if (page) {
			const numPage = Number(page);
			const numLimit = (isNaN(Number(limit))? LISTING_LIMIT: Number(limit));
			discussionsQuery = discussionsQuery.limit(numLimit).offset((numPage - 1) * numLimit);
		}
		const discussionsSnapshot = await discussionsQuery.get();
		if (discussionsSnapshot.size > 0) {
			discussionsSnapshot.docs.map((doc) => {
				if (doc && doc.exists) {
					const data = doc.data() as IDiscussion;
					if (data) {
						// Sanitization
						if ((data.id || data.id == 0) && data.house_id && data.room_id && data.proposer_address) {
							const comments_count = data.comments_count || 0;
							const reactions_count = {
								[EReaction.DISLIKE]: data?.reactions_count?.[EReaction.DISLIKE] || 0,
								[EReaction.LIKE]: data?.reactions_count?.[EReaction.LIKE] || 0
							};
							const discussion: IListingDiscussion = {
								comments_count,
								created_at: convertFirestoreTimestampToDate(data.created_at),
								house_id: data.house_id,
								id: data.id,
								proposer_address: data.proposer_address,
								reactions_count,
								room_id: data.room_id,
								tags: data.tags || [],
								title: data.title || ''
							};
							discussions.push(discussion);
						}
					}
				}
			});
		}
		return {
			data: JSON.parse(JSON.stringify(discussions)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: (error.name? Number(error.name): StatusCodes.INTERNAL_SERVER_ERROR)
		};
	}
};

export interface IDiscussionsBody {}
export interface IDiscussionsQuery {
    house_id: string;
    room_id: string;
	page?: number;
	limit?: number;
}
const handler: TNextApiHandler<IListingDiscussion[], IDiscussionsBody, IDiscussionsQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('GET') });
	}
	const { house_id, room_id, page, limit } = req.query;
	const {
		data: discussions,
		error,
		status
	} = await getDiscussions({ house_id, limit, page, room_id });

	if (discussions && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(discussions);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);