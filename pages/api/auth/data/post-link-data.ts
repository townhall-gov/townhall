// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { discussionCollection, proposalCollection } from '~src/services/firebase/utils';
import { EPostType } from '~src/types/enums';
import { IDiscussion, IProposal } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

interface IGetPostLinkDataFnParams {
    address: string;
    house_id: string;
    room_id: string;
    post_id: number;
    post_type: EPostType;
}

export type TGetPostLinkDataFn = (params: IGetPostLinkDataFnParams) => Promise<TApiResponse<IPostLinkData>>;
export const getPostLinkData: TGetPostLinkDataFn = async (params) => {
	try {
		const { address, house_id, post_id, post_type, room_id } = params;
		if (!address) {
			throw apiErrorWithStatusCode(messages.INVALID_TYPE('address'), StatusCodes.BAD_REQUEST);
		}

		if (![EPostType.DISCUSSION, EPostType.PROPOSAL].includes(post_type)) {
			throw apiErrorWithStatusCode(messages.INVALID_TYPE('post type'), StatusCodes.BAD_REQUEST);
		}

		if (!house_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('house'), StatusCodes.BAD_REQUEST);
		}

		if (!room_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('room'), StatusCodes.BAD_REQUEST);
		}

		const postLinkData: IPostLinkData = {
			description: '',
			tags: [],
			title: ''
		};

		const postColRef = (post_type === EPostType.DISCUSSION? discussionCollection(house_id, room_id): proposalCollection(house_id, room_id));

		const postDocRef = postColRef.doc(String(post_id));
		const postDoc = await postDocRef.get();

		if (!postDoc || !postDoc.exists || !postDoc.data()) {
			throw apiErrorWithStatusCode(messages.POST_NOT_FOUND, StatusCodes.NOT_FOUND);
		}

		const post = postDoc.data() as (IDiscussion | IProposal);

		if (post.proposer_address !== address) {
			throw apiErrorWithStatusCode(messages.NOT_THE_PROPOSER, StatusCodes.FORBIDDEN);
		}

		if (post.post_link || post.post_link_data) {
			throw apiErrorWithStatusCode(messages.POST_ALREADY_LINKED, StatusCodes.BAD_REQUEST);
		}

		postLinkData.description = post.description;
		postLinkData.tags = post.tags;
		postLinkData.title = post.title;

		return {
			data: JSON.parse(JSON.stringify(postLinkData)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: (error.name? Number(error.name): StatusCodes.INTERNAL_SERVER_ERROR)
		};
	}
};

export interface IPostLinkData {
    title: string;
    description: string;
    tags: string[];
}
export interface IPostLinkDataBody {}
export interface IPostLinkDataQuery {
    house_id: string;
    room_id: string;
    post_id: number;
    post_type: EPostType;
}
const handler: TNextApiHandler<IPostLinkData, IPostLinkDataBody, IPostLinkDataQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('GET') });
	}

	let address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('token') });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (!address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: messages.INVALID_TYPE('address') });
	}
	const { house_id, post_id, post_type, room_id } = req.query;
	const {
		data: postLinkData,
		error,
		status
	} = await getPostLinkData({ address, house_id, post_id, post_type, room_id  });

	if (postLinkData && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(postLinkData);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);