// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { houseCollection, discussionCollection, roomCollection, proposalCollection } from '~src/services/firebase/utils';
import { IDiscussion } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';
import { IPostLinkData } from '../data/post-link-data';

export interface IEditDiscussionBody {
    description: string;
    discussion_id: number;
    house_id: string;
    room_id: string;
    tags: string[];
    title: string;
}

export type TEditedDiscussion = {
    description: string;
    tags: string[];
    title: string;
    updated_at: Date;
};

const handler: TNextApiHandler<TEditedDiscussion, IEditDiscussionBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}
	const { description, title, tags, house_id, room_id, discussion_id } = req.body;

	if (!description || !title || !tags) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.MISSING_PARAM });
	}

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('house') });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('room') });
	}

	let logged_in_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('token') });
		}

		const user = await authServiceInstance.GetUser(token);
		if(!user) {
			return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		}
		logged_in_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	const houseDocSnapshot = await houseCollection.doc(house_id).get();
	if (!houseDocSnapshot.exists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_NOT_FOUND('House',house_id) });
	}

	const roomDocSnapshot = await roomCollection(house_id).doc(room_id).get();
	const roomData = roomDocSnapshot.data();
	if (!roomDocSnapshot.exists || !roomData) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE1_NOT_FOUND_IN_TYPE2('Room',room_id,'house',house_id) });
	}

	const discussionsColRef = discussionCollection(house_id, room_id);
	const discussionDocRef = discussionsColRef.doc(String(discussion_id));

	const discussionDocSnapshot = await discussionDocRef.get();
	if (!discussionDocSnapshot || !discussionDocSnapshot.exists || !discussionDocSnapshot.data()) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Discussion',discussion_id,room_id,house_id) });
	}

	const data = discussionDocSnapshot.data() as IDiscussion;
	if (data.proposer_address !== logged_in_address) {
		return res.status(StatusCodes.FORBIDDEN).json({ error: messages.ONLY_ACTION_OF_TYPE('proposer','discussion','edit') });
	}

	const now = new Date();
	const editedDiscussion: TEditedDiscussion = {
		description,
		tags,
		title,
		updated_at: now
	};

	await discussionDocRef.set(editedDiscussion, { merge: true });

	if (data.post_link && data.post_link_data) {
		const { house_id, room_id, post_id } = data.post_link;
		const postDocRef = proposalCollection(house_id, room_id).doc(String(post_id));
		const newPostLinkData: IPostLinkData = {
			description,
			tags,
			title
		};
		postDocRef.set({
			post_link_data: newPostLinkData
		}, { merge: true }).then(() => {});
	}

	res.status(StatusCodes.OK).json(editedDiscussion);
};

export default withErrorHandling(handler);