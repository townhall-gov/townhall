// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import { discussionCollection, proposalCollection, roomCollection } from '~src/services/firebase/utils';
import { EPostType, EReaction } from '~src/types/enums';
import { IDiscussion, IReaction, IRoom } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';
import { getErrorStatus } from '~src/utils/getErrorMessage';
import { getComments } from '../proposal';
import messages from '~src/auth/utils/messages';

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
			throw apiErrorWithStatusCode(messages.INVALID_ID('house'), StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('room'), StatusCodes.BAD_REQUEST);
		}
		if (!(discussion_id == 0) && !discussion_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('discussion'), StatusCodes.BAD_REQUEST);
		}
		const roomDocRef = roomCollection(house_id).doc(room_id);
		const roomDocSnapshot = await roomDocRef.get();
		const roomData = roomDocSnapshot?.data() as IRoom;

		if (!roomDocSnapshot || !roomDocSnapshot.exists || !roomData) {
			throw apiErrorWithStatusCode(messages.TYPE1_NOT_FOUND_IN_TYPE2('Room',room_id,'house',house_id), StatusCodes.NOT_FOUND);
		}

		// Get discussion
		const discussionDocRef = discussionCollection(house_id, room_id).doc(String(discussion_id));
		const discussionDocSnapshot = await discussionDocRef.get();
		const data = discussionDocSnapshot?.data() as IDiscussion;
		// Check if discussion exists
		if (!discussionDocSnapshot || !discussionDocSnapshot.exists || !data) {
			throw apiErrorWithStatusCode(messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Discussion',discussion_id,room_id,house_id), StatusCodes.NOT_FOUND);
		}

		// Sanitization
		if ((data.id || data.id == 0) && data.house_id && data.room_id && data.proposer_address) {
			// Get discussion reactions
			const reactions: IReaction[] = [];
			const reactions_count = {
				[EReaction.DISLIKE]: 0,
				[EReaction.LIKE]: 0
			};
			const reactionsQuerySnapshot = await discussionDocRef.collection('reactions').get();
			reactionsQuerySnapshot.docs.forEach((doc) => {
				if (doc && doc.exists) {
					const data  = doc.data() as IReaction;
					if (data && data.user_address && data.id && data.type) {
						reactions_count[data.type] = reactions_count[data.type] + 1;
						reactions.push(data);
					}
				}
			});

			// Get comments
			const commentsQuerySnapshot = await discussionDocRef.collection('comments').orderBy('created_at', 'desc').get();
			let comments = await getComments(commentsQuerySnapshot, {
				house_id: house_id,
				post_type: EPostType.DISCUSSION,
				room_id: room_id
			});

			if (data.post_link) {
				const { house_id, room_id, post_id, post_type } = data.post_link;
				const postColRef = (post_type === EPostType.DISCUSSION? discussionCollection(house_id, room_id): proposalCollection(house_id, room_id));
				const postDocRef = postColRef.doc(String(post_id));
				const commentsQuerySnapshot = await postDocRef.collection('comments').orderBy('created_at', 'asc').get();
				const postLinkComments = await getComments(commentsQuerySnapshot, {
					house_id: house_id,
					post_type: post_type,
					room_id: room_id
				});
				comments = [...comments, ...postLinkComments].sort((a, b) => {
					return b.created_at.getTime() - a.created_at.getTime();
				});
			}

			// Construct discussion
			const discussion: IDiscussion = {
				comments: comments,
				comments_count: comments.length,
				created_at: convertFirestoreTimestampToDate(data.created_at),
				description: data.description || '',
				house_id: data.house_id,
				id: data.id,
				post_link: data.post_link || null,
				post_link_data: data.post_link_data || null,
				proposer_address: data.proposer_address,
				reactions: reactions,
				reactions_count: reactions_count,
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
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('GET') });
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