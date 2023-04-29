// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StatusCodes } from 'http-status-codes';
import withErrorHandling from '~src/api/middlewares/withErrorHandling';
import { TNextApiHandler } from '~src/api/types';
import authServiceInstance from '~src/auth';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { proposalCollection } from '~src/services/firebase/utils';
import { EReaction } from '~src/types/enums';
import { IReaction } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export interface IReactionBody {
    type: EReaction;
    proposal_id: number;
    room_id: string;
    house_id: string;
}

export interface IReactionResponse {
    reaction: IReaction;
    isDeleted: boolean;
}

const handler: TNextApiHandler<IReactionResponse, IReactionBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}

	const { type, proposal_id, room_id, house_id } = req.body;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid houseId.' });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid roomId.' });
	}

	if ((!proposal_id && proposal_id != 0) || typeof proposal_id !== 'number') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid proposalId.' });
	}

	let user_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		user_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (!user_address) {
		return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: 'Invalid address.' });
	}

	const proposalsColRef = proposalCollection(house_id, room_id);
	const proposalDocRef = proposalsColRef.doc(String(proposal_id));
	const proposalDoc = await proposalDocRef.get();

	if (!proposalDoc || !proposalDoc.exists) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: `Proposal with id "${proposal_id}" is not found in a Room with id "${room_id}" and a House with id "${house_id}".` });
	}

	const reactionsColRef = proposalDocRef.collection('reactions');
	const reactionQuerySnapshot = await reactionsColRef.where('user_address', '==', user_address).get();
	if (reactionQuerySnapshot && !reactionQuerySnapshot.empty && reactionQuerySnapshot.size > 1) {
		return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: `More than one reaction with user address "${user_address}" exists.` });
	}

	let reactionDocRef = reactionsColRef.doc();
	if (reactionQuerySnapshot.docs.length > 0) {
		const doc = reactionQuerySnapshot.docs[0];
		if (doc && doc.exists) {
			const data = doc.data() as IReaction;
			if (data.type === type) {
				await doc.ref.delete();
				return res.status(StatusCodes.OK).json({
					isDeleted: true,
					reaction: data
				});
			} else {
				reactionDocRef = doc.ref;
			}
		}
	}
	const reaction: IReaction = {
		id: reactionDocRef.id,
		type: type,
		user_address: user_address
	};
	reactionDocRef.set(reaction, { merge: true });
	res.status(StatusCodes.OK).json({
		isDeleted: false,
		reaction: reaction
	});
};

export default withErrorHandling(handler);