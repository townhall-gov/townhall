// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { IListingDiscussion } from '~src/redux/room/@types';
import { discussionCollection } from '~src/services/firebase/utils';
import { EReaction } from '~src/types/enums';
import { IDiscussion } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IGetDiscussionsFnParams {
    house_id: string;
    room_id: string;
}

export type TGetDiscussionsFn = (params: IGetDiscussionsFnParams) => Promise<TApiResponse<IListingDiscussion[]>>;
export const getDiscussions: TGetDiscussionsFn = async (params) => {
	try {
		const { house_id, room_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode('Invalid roomId.', StatusCodes.BAD_REQUEST);
		}
		const discussions: IListingDiscussion[] = [];
		const discussionsSnapshot = await discussionCollection(house_id, room_id).orderBy('created_at', 'desc').get();
		if (discussionsSnapshot.size > 0) {
			const discussionsPromise = discussionsSnapshot.docs.map(async (doc) => {
				if (doc && doc.exists) {
					const data = doc.data() as IDiscussion;
					if (data) {
						// Sanitization
						if ((data.id || data.id == 0) && data.house_id && data.room_id && data.proposer_address) {
							let comments_count = 0;
							const commentsAggregateQuery = await doc.ref.collection('comments').count().get();
							if (commentsAggregateQuery && commentsAggregateQuery.data()) {
								const commentsAggregateSpecData = commentsAggregateQuery.data();
								comments_count = commentsAggregateSpecData.count;
							}
							const reactions_count = {
								[EReaction.DISLIKE]: 0,
								[EReaction.LIKE]: 0
							};
							const likeReactionsAggregateQuery = await doc.ref.collection('reactions').where('type', '==', EReaction.LIKE).count().get();
							if (likeReactionsAggregateQuery && likeReactionsAggregateQuery.data()) {
								const likeAggregateSpecData = likeReactionsAggregateQuery.data();
								reactions_count[EReaction.LIKE] = likeAggregateSpecData.count;
							}
							const dislikeReactionsAggregateQuery = await doc.ref.collection('reactions').where('type', '==', EReaction.DISLIKE).count().get();
							if (dislikeReactionsAggregateQuery && dislikeReactionsAggregateQuery.data()) {
								const dislikeAggregateSpecData = dislikeReactionsAggregateQuery.data();
								reactions_count[EReaction.DISLIKE] = dislikeAggregateSpecData.count;
							}
							const proposal: IListingDiscussion = {
								comments_count,
								created_at: convertFirestoreTimestampToDate(data.created_at),
								house_id: data.house_id,
								id: data.id,
								post_link: null,
								proposer_address: data.proposer_address,
								reactions_count,
								room_id: data.room_id,
								tags: data.tags || [],
								title: data.title || ''
							};
							return proposal;
						}
					}
				}
			});

			const discussionsPromiseSettledResult = await Promise.allSettled(discussionsPromise);
			discussionsPromiseSettledResult.forEach((result) => {
				if (result && result.status === 'fulfilled' && result.value) {
					discussions.push(result.value);
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
}
const handler: TNextApiHandler<IListingDiscussion[], IDiscussionsBody, IDiscussionsQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { house_id, room_id } = req.query;
	const {
		data: discussions,
		error,
		status
	} = await getDiscussions({ house_id, room_id });

	if (discussions && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(discussions);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);