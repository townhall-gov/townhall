// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TApiResponse } from '~src/api/types';
import { TNextApiHandler } from '~src/api/types';
import messages from '~src/auth/utils/messages';
import { discussionCollection, proposalCollection, roomCollection } from '~src/services/firebase/utils';
import { EPostType, EProposalStatus, EReaction, ESentiment } from '~src/types/enums';
import { IComment, IProposal, IReaction, IReply, IRoom } from '~src/types/schema';
import apiErrorWithStatusCode from '~src/utils/apiErrorWithStatusCode';
import convertFirestoreTimestampToDate from '~src/utils/convertFirestoreTimestampToDate';
import getErrorMessage from '~src/utils/getErrorMessage';
import { getErrorStatus } from '~src/utils/getErrorMessage';

interface IGetProposalFnParams {
    house_id: string;
    room_id: string;
    proposal_id: number;
}

type TGetCommentsFn = (commentsQuerySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>, commentInfo: {
	post_type: EPostType;
	room_id: string;
	house_id: string;
}) => Promise<IComment[]>;

export const getComments: TGetCommentsFn = async (commentsQuerySnapshot, commentInfo) => {
	const { house_id, post_type, room_id } = commentInfo;
	const comments: IComment[] = [];
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
								house_id: data.house_id || house_id,
								id: data.id,
								is_deleted: data.is_deleted || false,
								post_id: data.post_id,
								post_type: data.post_type || post_type,
								reactions: reactions,
								room_id: data.room_id || room_id,
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
					house_id: data.house_id || house_id,
					id: data.id,
					is_deleted: data.is_deleted || false,
					post_id: data.post_id,
					post_type: data.post_type || post_type,
					reactions: reactions,
					replies,
					room_id: data.room_id || room_id,
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
	return comments;
};

export type TGetProposalFn = (params: IGetProposalFnParams) => Promise<TApiResponse<IProposal>>;
export const getProposal: TGetProposalFn = async (params) => {
	try {
		const { house_id, room_id, proposal_id } = params;
		if (!house_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('house'), StatusCodes.BAD_REQUEST);
		}
		if (!room_id) {
			throw apiErrorWithStatusCode(messages.INVALID_ID('room'), StatusCodes.BAD_REQUEST);
		}
		if (!(proposal_id == 0) && !proposal_id) {
			throw apiErrorWithStatusCode('Invalid proposalId.', StatusCodes.BAD_REQUEST);
		}
		const roomDocRef = roomCollection(house_id).doc(room_id);
		const roomDocSnapshot = await roomDocRef.get();
		const roomData = roomDocSnapshot?.data() as IRoom;

		if (!roomDocSnapshot || !roomDocSnapshot.exists || !roomData) {
			throw apiErrorWithStatusCode(`Room with id ${room_id} is not found in a house with id ${house_id}.`, StatusCodes.NOT_FOUND);
		}

		// Get proposal
		const proposalDocRef = proposalCollection(house_id, room_id).doc(String(proposal_id));
		const proposalDocSnapshot = await proposalDocRef.get();
		const data = proposalDocSnapshot?.data() as IProposal;
		// Check if proposal exists
		if (!proposalDocSnapshot || !proposalDocSnapshot.exists || !data) {
			throw apiErrorWithStatusCode(`Proposal with id ${proposal_id} is not found in a room with id ${room_id} and a house with id ${house_id}.`, StatusCodes.NOT_FOUND);
		}

		// Sanitization
		if ((data.id || data.id == 0) && data.house_id && data.room_id && data.proposer_address) {
			// Get proposal reactions
			const reactions: IReaction[] = [];
			const reactions_count = {
				[EReaction.DISLIKE]: 0,
				[EReaction.LIKE]: 0
			};
			const reactionsQuerySnapshot = await proposalDocRef.collection('reactions').get();
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
			const commentsQuerySnapshot = await proposalDocRef.collection('comments').orderBy('created_at', 'asc').get();
			let comments = await getComments(commentsQuerySnapshot, {
				house_id: house_id,
				post_type: EPostType.PROPOSAL,
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

			const isClosed = dayjs().isAfter(convertFirestoreTimestampToDate(data.end_date));
			const isActive = dayjs().isBetween(convertFirestoreTimestampToDate(data.start_date), convertFirestoreTimestampToDate(data.end_date));
			const isPending = dayjs().isBefore(convertFirestoreTimestampToDate(data.start_date));
			let status = data.status;
			if (isClosed && status !== EProposalStatus.CLOSED) {
				proposalDocRef.set({
					status: EProposalStatus.CLOSED
				}, { merge: true }).then(() => {});
				status = EProposalStatus.CLOSED;
			} else if (isActive && status !== EProposalStatus.ACTIVE) {
				proposalDocRef.set({
					status: EProposalStatus.ACTIVE
				}, { merge: true }).then(() => {});
				status = EProposalStatus.ACTIVE;
			} else if (isPending && status !== EProposalStatus.PENDING) {
				proposalDocRef.set({
					status: EProposalStatus.PENDING
				}, { merge: true }).then(() => {});
				status = EProposalStatus.PENDING;
			}
			// Construct proposal
			const proposal: IProposal = {
				comments: comments,
				comments_count: comments.length,
				created_at: convertFirestoreTimestampToDate(data.created_at),
				description: data.description || '',
				discussion: data.discussion || '',
				end_date: convertFirestoreTimestampToDate(data.end_date),
				house_id: data.house_id,
				id: data.id,
				is_vote_results_hide_before_voting_ends: data.is_vote_results_hide_before_voting_ends || false,
				post_link: data.post_link || null,
				post_link_data: data.post_link_data || null,
				proposer_address: data.proposer_address,
				reactions: reactions,
				reactions_count: reactions_count,
				room_id: data.room_id,
				start_date: convertFirestoreTimestampToDate(data.start_date),
				status: status,
				tags: data.tags || [],
				title: data.title || '',
				updated_at: convertFirestoreTimestampToDate(data.updated_at),
				votes_result: data.votes_result,
				voting_strategies_with_height: data.voting_strategies_with_height,
				voting_system: data.voting_system,
				voting_system_options: data.voting_system_options
			};
			return {
				data: JSON.parse(JSON.stringify(proposal)),
				status: StatusCodes.OK
			};
		}
		return {
			error: 'Invalid proposal data.',
			status: StatusCodes.NO_CONTENT
		};
	} catch (error) {
		return {
			error: getErrorMessage(error),
			status: getErrorStatus(error)
		};
	}
};

export interface IProposalBody {}
export interface IProposalQuery {
    house_id: string;
    room_id: string;
    proposal_id: number;
}

const handler: TNextApiHandler<IProposal, IProposalBody, IProposalQuery> = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: messages.INVALID_REQ_METHOD('GET') });
	}
	const { house_id, room_id, proposal_id } = req.query;
	const {
		data: proposal,
		error,
		status
	} = await getProposal({ house_id, proposal_id, room_id });

	if (proposal && !error && (status === 200)) {
		res.status(StatusCodes.OK).json(proposal);
	} else {
		const numStatus = Number(status);
		res.status(isNaN(numStatus)? StatusCodes.INTERNAL_SERVER_ERROR: numStatus).json({ error });
	}
};

export default withErrorHandling(handler as any);