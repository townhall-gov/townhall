// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { discussionCollection, proposalCollection } from '~src/services/firebase/utils';
import { EAction, EPostType } from '~src/types/enums';
import { IDiscussion, IPostLink, IProposal } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';
import { IPostLinkData } from '../data/post-link-data';

export interface IPostLinkBody {
    post_id: number;
	post_type: EPostType;
	post_link: IPostLink;
	post_link_data: IPostLinkData;
    room_id: string;
    house_id: string;
    action_type: EAction;
}

export type TUpdatedPost = {
	post_link: IPostLink | null;
	updated_at: Date;
	post_link_data: IPostLinkData | null;
};

export interface IPostLinkResponse {
    updatedPost: TUpdatedPost;
}

const handler: TNextApiHandler<IPostLinkResponse, IPostLinkBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('POST') });
	}

	const { post_id, post_type, room_id, house_id, post_link, action_type, post_link_data } = req.body;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('house') });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('room') });
	}

	if ((!post_id && post_id != 0) || typeof post_id !== 'number') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_ID('post') });
	}

	if (!action_type || ![EAction.ADD, EAction.DELETE, EAction.EDIT].includes(action_type)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('api action type') });
	}

	if (!post_type || ![EPostType.DISCUSSION, EPostType.PROPOSAL].includes(post_type)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('post type') });
	}

	if (!post_link || typeof post_link !== 'object' || ![EPostType.DISCUSSION, EPostType.PROPOSAL].includes(post_link.post_type)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Unable to link the post.' });
	}

	if ([EAction.EDIT, EAction.DELETE].includes(action_type) && (post_link?.post_id != 0)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('Post link post id') });
	}

	if (post_type === post_link.post_type) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.UNABLE_TO_TYPE1_DUE_TYPE2('link the post',',you are linking similar type of post') });
	}

	let user_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({ error: messages.INVALID_TYPE('token') });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		user_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (!user_address) {
		return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: messages.INVALID_TYPE('address') });
	}

	const postsColRef = post_type === EPostType.PROPOSAL? proposalCollection(house_id, room_id): discussionCollection(house_id, room_id);
	const postDocRef = postsColRef.doc(String(post_id));
	const postDoc = await postDocRef.get();
	const data = postDoc.data() as (IDiscussion | IProposal);

	if (!postDoc || !postDoc.exists) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Post',post_id,room_id,house_id) });
	}

	const linkPostsColRef = post_link.post_type === EPostType.PROPOSAL? proposalCollection(post_link.house_id, post_link.room_id): discussionCollection(post_link.house_id, post_link.room_id);
	const linkPostDocRef = linkPostsColRef.doc(String(post_link.post_id));
	const linkPostDoc = await linkPostDocRef.get();
	const linkPostData = linkPostDoc.data() as (IDiscussion | IProposal);

	if (!linkPostDoc || !linkPostDoc.exists) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: messages.TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE('Link post',post_link.post_id,post_link.room_id,post_link.house_id) });
	}

	if (user_address !== data.proposer_address || user_address !== linkPostData.proposer_address) {
		return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED_VOTE });
	}

	const now = new Date();

	const updatedPost: TUpdatedPost = {
		post_link: post_link,
		post_link_data: post_link_data,
		updated_at: now
	};

	const updatedLinkedPost: TUpdatedPost = {
		post_link: {
			house_id,
			post_id,
			post_type,
			room_id
		},
		post_link_data: {
			description: data.description,
			tags: data.tags,
			title: data.title
		},
		updated_at: now
	};

	if (action_type === EAction.ADD) {
		if (data.post_link) {
			return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: messages.ALREADY_POST_LINK_WITH(post_id,data?.post_link?.post_id) });
		}
		await postDocRef.set(updatedPost, { merge: true });
		await linkPostDocRef.set(updatedLinkedPost, { merge: true });
	} else if (action_type === EAction.DELETE) {
		if (!data.post_link) {
			return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: messages.UNABLE_TO_UNLINK_ANYPOST(post_id)  });
		}

		if (data?.post_link?.post_id === post_link.post_id && data?.post_link?.post_type === post_link.post_type && data?.post_link?.house_id === post_link.house_id && data?.post_link?.room_id === post_link.room_id) {
			updatedPost.post_link = null;
			updatedPost.post_link_data = null;
			await postDocRef.update(updatedPost);

			updatedLinkedPost.post_link = null;
			updatedLinkedPost.post_link_data = null;
			await linkPostDocRef.update(updatedLinkedPost);
		} else {
			return res.status(StatusCodes.NOT_FOUND).json({ error: messages.UNABLE_TO_UNLINK(post_link.post_id,post_id) });
		}
	} else if (action_type === EAction.EDIT) {
		if (!data.post_link) {
			return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: messages.UNABLE_TO_EDIT_POSTLINK(post_id) });
		}

		if (data?.post_link?.post_id === post_link.post_id && data?.post_link?.post_type === post_link.post_type && data?.post_link?.house_id === post_link.house_id && data?.post_link?.room_id === post_link.room_id) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.UNABLE_TO_TYPE1_DUE_TYPE2('edit post_link',', as you are linking same post again.') });
		} else {
			await postDocRef.update(updatedPost);
			await linkPostDocRef.update(updatedLinkedPost);
		}
	} else {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('api action type') });
	}

	res.status(StatusCodes.OK).json({
		updatedPost: updatedPost
	});
};

export default withErrorHandling(handler);