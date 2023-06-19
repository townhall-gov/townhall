// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { discussionCollection, roomCollection } from '~src/services/firebase/utils';
import { ESentiment } from '~src/types/enums';
import { IComment, IDiscussion, IReaction, IReply, IRoom } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';
import { getErrorStatus } from '~src/utils/getErrorMessage';

interface IGetDiscussionFnParams {
    house_id: string;
    room_id: string;
    discussion_id: number;
}

export type TGetDiscussionFn = (params: IGetDiscussionFnParams) => Promise<TApiResponse<IDiscussion>>;
export const getDiscussion: TGetDiscussionFn = async (params) => {
	try {
		const { house_id, room_id, discussion_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode('Invalid houseId.', StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode('Invalid roomId.', StatusCodes.BAD_REQUEST);
		}
		if (!(discussion_id == 0) && !discussion_id) {
			throw apiErrorWithStatusCode('Invalid discussionId.', StatusCodes.BAD_REQUEST);
		}
		const roomDocRef = roomCollection(house_id).doc(room_id);
		const roomDocSnapshot = await roomDocRef.get();
		const roomData = roomDocSnapshot?.data() as IRoom;

		if (!roomDocSnapshot || !roomDocSnapshot.exists || !roomData) {
			throw apiErrorWithStatusCode(`Room "${room_id}" is not found in a house "${house_id}".`, StatusCodes.NOT_FOUND);
		}

		// Get discussion
		const discussionDocRef = discussionCollection(house_id, room_id).doc(String(discussion_id));
		const discussionDocSnapshot = await discussionDocRef.get();
		const data = discussionDocSnapshot?.data() as IDiscussion;
		// Check if discussion exists
		if (!discussionDocSnapshot || !discussionDocSnapshot.exists || !data) {
			throw apiErrorWithStatusCode(`Discussion "${discussion_id}" is not found in a room "${room_id}" and a house "${house_id}".`, StatusCodes.NOT_FOUND);
		}

		// Sanitization
		if ((data.id || data.id == 0) && data.house_id && data.room_id && data.proposer_address) {
			// Get discussion reactions
			const reactions: IReaction[] = [];
			const reactionsQuerySnapshot = await discussionDocRef.collection('reactions').get();
			reactionsQuerySnapshot.docs.forEach((doc) => {
				if (doc && doc.exists) {
					const data  = doc.data() as IReaction;
					if (data && data.user_address && data.id && data.type) {
						reactions.push(data);
					}
				}
			});
			// Get comments
			const comments: IComment[] = [];
			const commentsQuerySnapshot = await discussionDocRef.collection('comments').orderBy('updated_at', 'desc').get();
			const commentsPromise = commentsQuerySnapshot.docs.map(async (doc) => {
				if (doc && doc.exists) {
					const data  = doc.data() as IComment;
					// only take comment which is not deleted
					if (data && data.user_address && data.id && !data.is_deleted) {
						// need to create history array manually because we need to transform the created_at date
						const history = (data.history || []).map((historyItem) => {
							return {
								content: historyItem.content,
								created_at: convertFirestoreTimestampToDate(historyItem.created_at),
								sentiment: historyItem.sentiment || ESentiment.NEUTRAL
							};
						});
						// Get comment reactions
						const reactions: IReaction[] = [];
						const reactionsQuerySnapshot = await doc.ref.collection('reactions').get();
						reactionsQuerySnapshot.docs.forEach((doc) => {
							if (doc && doc.exists) {
								const data  = doc.data() as IReaction;
								if (data && data.user_address && data.id && data.type) {
									reactions.push(data);
								}
							}
						});

						// Get comment Replies
						const replies: IReply[] = [];
						const repliesQuerySnapshot = await doc.ref.collection('replies').orderBy('updated_at', 'desc').get();
						const repliesPromise = repliesQuerySnapshot.docs.map(async (doc) => {
							if (doc && doc.exists) {
								const data = doc.data() as IReply;
								// only take reply which is not deleted
								if (data && data.user_address && data.id && !data.is_deleted) {
									// need to create history array manually because we need to transform the created_at date
									const history = (data.history || []).map((historyItem) => {
										return {
											content: historyItem.content,
											created_at: convertFirestoreTimestampToDate(historyItem.created_at),
											sentiment: historyItem.sentiment || ESentiment.NEUTRAL
										};
									});
									// Get reply reactions
									const reactions: IReaction[] = [];
									const reactionsQuerySnapshot = await doc.ref.collection('reactions').get();
									reactionsQuerySnapshot.docs.forEach((doc) => {
										if (doc && doc.exists) {
											const data  = doc.data() as IReaction;
											if (data && data.user_address && data.id && data.type) {
												reactions.push(data);
											}
										}
									});

									// Construct reply
									const reply: IReply = {
										comment_id: data.comment_id,
										content: data.content,
										created_at: convertFirestoreTimestampToDate(data.created_at),
										deleted_at: convertFirestoreTimestampToDate(data.deleted_at),
										history: history,
										id: data.id,
										is_deleted: data.is_deleted || false,
										post_id: data.post_id,
										reactions: reactions,
										sentiment: data.sentiment || ESentiment.NEUTRAL,
										updated_at: convertFirestoreTimestampToDate(data.updated_at),
										user_address: data.user_address
									};
									return reply;
								}
							}
						});
						// Wait for all replies to be resolved
						const repliesPromiseSettledResult = await Promise.allSettled(repliesPromise);
						repliesPromiseSettledResult.forEach((result) => {
							// Only push reply if it is resolved and has value
							if (result && result.status === 'fulfilled' && result.value) {
								replies.push(result.value);
							}
						});

						// Construct comment
						const comment: IComment = {
							content: data.content,
							created_at: convertFirestoreTimestampToDate(data.created_at),
							deleted_at: convertFirestoreTimestampToDate(data.deleted_at),
							history: history,
							id: data.id,
							is_deleted: data.is_deleted || false,
							post_id: data.post_id || discussion_id,
							reactions: reactions,
							replies,
							sentiment: data.sentiment || ESentiment.NEUTRAL,
							updated_at: convertFirestoreTimestampToDate(data.updated_at),
							user_address: data.user_address
						};
						return comment;
					}
				}
			});
			// Wait for all comments to be resolved
			const commentsPromiseSettledResult = await Promise.allSettled(commentsPromise);
			commentsPromiseSettledResult.forEach((result) => {
				// Only push comment if it is resolved and has value
				if (result && result.status === 'fulfilled' && result.value) {
					comments.push(result.value);
				}
			});
			// Construct discussion
			const discussion: IDiscussion = {
				comments: comments,
				created_at: convertFirestoreTimestampToDate(data.created_at),
				description: data.description || '',
				house_id: data.house_id,
				id: data.id,
				post_link: data.post_link || null,
				post_link_data: data.post_link_data || null,
				proposer_address: data.proposer_address,
				reactions: reactions,
				room_id: data.room_id,
				tags: data.tags || [],
				title: data.title || '',
				updated_at: convertFirestoreTimestampToDate(data.updated_at)
			};
			return {
				data: JSON.parse(JSON.stringify(discussion)),
				status: StatusCodes.OK
			};
		}
		return {
			error: 'Invalid discussion data.',
			status: StatusCodes.NO_CONTENT
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: getErrorStatus(error)
		};
	}
};

export interface IDiscussionBody {}
export interface IDiscussionQuery {
    house_id: string;
    room_id: string;
    discussion_id: number;
}

const handler: TNextApiHandler<IDiscussion, IDiscussionBody, IDiscussionQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, GET required.' });
	}
	const { house_id, room_id, discussion_id } = req.query;
	const {
		data: discussion,
		error,
		status
	} = await getDiscussion({ discussion_id, house_id, room_id });

	if (discussion && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(discussion);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);