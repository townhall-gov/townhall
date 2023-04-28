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
import { IProposal } from '~src/types/schema';
import getErrorMessage, { getErrorStatus } from '~src/utils/getErrorMessage';

export type TProposalPayload = Omit<IProposal, 'proposer_address' | 'created_at' | 'updated_at' | 'id' | 'timestamp'>;

export interface ICreateProposalBody {
    proposal: TProposalPayload & {
        timestamp: number;
    };
    signature: string;
    proposer_address: string;
}

export interface ICreateProposalResponse {
	createdProposal: IProposal;
}

const handler: TNextApiHandler<ICreateProposalResponse, ICreateProposalBody, {}> = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: 'Invalid request method, POST required.' });
	}
	const { proposal, proposer_address, signature } = req.body;

	if (!proposal || typeof proposal !== 'object') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Unable to create a proposal, insufficient information for creating a proposal.' });
	}

	if (!signature) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid signature.' });
	}

	if (!proposer_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid address.' });
	}

	const { house_id, room_id } = proposal;

	if (!house_id || typeof house_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid houseId.' });
	}

	if (!room_id || typeof room_id !== 'string') {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid roomId.' });
	}

	let logged_in_address: string | null = null;
	try {
		const token = getTokenFromReq(req);
		if(!token) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid token' });

		const user = await authServiceInstance.GetUser(token);
		if(!user) return res.status(StatusCodes.FORBIDDEN).json({ error: messages.UNAUTHORISED });
		logged_in_address = user.address;
	} catch (error) {
		return res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
	}

	if (proposer_address !== logged_in_address) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'LoggedIn address is not matching with Proposer address' });
	}

	let newID = 0;
	const proposalsColRef = proposalCollection(house_id, room_id);
	const lastProposalQuerySnapshot = await proposalsColRef.orderBy('id', 'desc').limit(1).get();
	if (!lastProposalQuerySnapshot.empty && lastProposalQuerySnapshot.docs.length > 0) {
		const lastProposalDoc = lastProposalQuerySnapshot.docs[0];
		if (lastProposalDoc) {
			const lastProposalData = lastProposalDoc.data() as IProposal;
			newID = Number(lastProposalData.id) + 1;
		}
	}

	const proposalDocRef = proposalsColRef.doc(String(newID));
	const proposalDocSnapshot = await proposalDocRef.get();
	if (proposalDocSnapshot && proposalDocSnapshot.exists && proposalDocSnapshot.data()) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: `Proposal with id ${newID} already exists in a Room with id ${room_id} and a House with id ${house_id}.` });
	}

	const newProposal: IProposal = {
		...proposal,
		created_at: new Date(),
		id: newID,
		proposer_address: proposer_address,
		updated_at: new Date()
	};

	await proposalDocRef.set(newProposal, { merge: true });

	res.status(StatusCodes.OK).json({
		createdProposal: newProposal
	});
};

export default withErrorHandling(handler);