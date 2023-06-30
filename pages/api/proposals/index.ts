// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { IListingProposal } from '~src/redux/room/@types';
import { proposalCollection } from '~src/services/firebase/utils';
import { EProposalStatus, EReaction } from '~src/types/enums';
import { IProposal } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';
import { LISTING_LIMIT } from '~src/utils/proposalListingLimit';

interface IGetProposalsFnParams {
    house_id: string;
    room_id: string;
	filter_by?: string;
	page?: number;
	limit?: number;
}

export type TGetProposalsFn = (params: IGetProposalsFnParams) => Promise<TApiResponse<IListingProposal[]>>;
export const getProposals: TGetProposalsFn = async (params) => {
	try {
		const { house_id, room_id, filter_by, page, limit } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode(messages.INVALID_HOUSE_ID, StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ROOM_ID, StatusCodes.BAD_REQUEST);
		}
		if (page) {
			const numPage = Number(page);
			if (isNaN(numPage) || numPage < 0) {
				throw apiErrorWithStatusCode('Invalid page.', StatusCodes.BAD_REQUEST);
			}
		}
		if (limit) {
			const numLimit = Number(limit);
			if (isNaN(numLimit) || numLimit < 0) {
				throw apiErrorWithStatusCode('Invalid limit.', StatusCodes.BAD_REQUEST);
			}
		}
		const proposals: IListingProposal[] = [];
		let proposalsQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = proposalCollection(house_id, room_id).orderBy('created_at', 'desc');
		if (filter_by && [EProposalStatus.ACTIVE.toString(), EProposalStatus.PENDING.toString(), EProposalStatus.CLOSED.toString()].includes(filter_by)) {
			proposalsQuery = proposalCollection(house_id, room_id).orderBy('created_at', 'desc').where('status', '==', filter_by);
		}

		if (page) {
			const numPage = Number(page);
			const numLimit = (isNaN(Number(limit))? LISTING_LIMIT: Number(limit));
			proposalsQuery = proposalsQuery.limit(numLimit).offset((numPage - 1) * numLimit);
		}
		const proposalsSnapshot = await proposalsQuery.get();
		if (proposalsSnapshot.size > 0) {
			const proposalsPromise = proposalsSnapshot.docs.map(async (doc) => {
				if (doc && doc.exists) {
					const data = doc.data() as IProposal;
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
							const isClosed = dayjs().isAfter(convertFirestoreTimestampToDate(data.end_date));
							const isActive = dayjs().isBetween(convertFirestoreTimestampToDate(data.start_date), convertFirestoreTimestampToDate(data.end_date));
							const isPending = dayjs().isBefore(convertFirestoreTimestampToDate(data.start_date));
							let status = data.status;
							if (isClosed && status !== EProposalStatus.CLOSED) {
								doc.ref.set({
									status: EProposalStatus.CLOSED
								}, { merge: true }).then(() => {});
								status = EProposalStatus.CLOSED;
							} else if (isActive && status !== EProposalStatus.ACTIVE) {
								doc.ref.set({
									status: EProposalStatus.ACTIVE
								}, { merge: true }).then(() => {});
								status = EProposalStatus.ACTIVE;
							} else if (isPending && status !== EProposalStatus.PENDING) {
								doc.ref.set({
									status: EProposalStatus.PENDING
								}, { merge: true }).then(() => {});
								status = EProposalStatus.PENDING;
							}
							const proposal: IListingProposal = {
								comments_count,
								created_at: convertFirestoreTimestampToDate(data.created_at),
								end_date: convertFirestoreTimestampToDate(data.end_date),
								house_id: data.house_id,
								id: data.id,
								proposer_address: data.proposer_address,
								reactions_count,
								room_id: data.room_id,
								start_date: convertFirestoreTimestampToDate(data.start_date),
								status: status,
								tags: data.tags || [],
								title: data.title || '',
								votes_result: data.votes_result || {},
								voting_strategies_with_height: data.voting_strategies_with_height
							};
							return proposal;
						}
					}
				}
			});

			const proposalsPromiseSettledResult = await Promise.allSettled(proposalsPromise);
			proposalsPromiseSettledResult.forEach((result) => {
				if (result && result.status === 'fulfilled' && result.value) {
					proposals.push(result.value);
				}
			});
		}
		return {
			data: JSON.parse(JSON.stringify(proposals)),
			status: StatusCodes.OK
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: (error.name? Number(error.name): StatusCodes.INTERNAL_SERVER_ERROR)
		};
	}
};

export interface IProposalsBody {}
export interface IProposalsQuery {
    house_id: string;
    room_id: string;
	filter_by?: string;
	page?: number;
	limit?: number;
}
const handler: TNextApiHandler<IListingProposal[], IProposalsBody, IProposalsQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_GET_REQUEST });
	}
	const { house_id, room_id, filter_by, page, limit } = req.query;
	const {
		data: proposals,
		error,
		status
	} = await getProposals({ filter_by, house_id, limit, page, room_id });

	if (proposals && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(proposals);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);