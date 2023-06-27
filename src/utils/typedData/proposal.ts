// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from 'dayjs';
import { TProposalPayload } from 'pages/api/auth/actions/createProposal';
import { IVotingSystemOption } from '~src/redux/room/@types';

interface IProposalTypedData {
    types: {
        ProposalPayload: ProposalPayload[];
        VotingSystemOption: VotingSystemOption[];
    };
    primaryType: 'ProposalPayload';
    message: ProposalPayloadData;
}

interface VotingSystemOption {
    name: string;
    type: string;
}

interface ProposalPayload {
    name: string;
    type: string;
}

interface ProposalPayloadData {
	house: string;
	room: string;
	title: string;
	description: string;
    tags: string[];
	'voting system': string;
	'voting system options': IVotingSystemOption[];
	'start date': string;
	'end date': string;
}

export const getProposalTypeData: (proposalPayload: TProposalPayload, isEVM: boolean) => (IProposalTypedData | ProposalPayloadData)= (proposalPayload, isEVM) => {
	if (!isEVM) {
		return {
			description: proposalPayload.description,
			'end date': dayjs(proposalPayload.end_date).format('MMMM D, YYYY h:mm A'),
			house: proposalPayload.house_id,
			room: proposalPayload.room_id,
			'start date': dayjs(proposalPayload.end_date).format('MMMM D, YYYY h:mm A'),
			tags: proposalPayload.tags,
			title: proposalPayload.title,
			'voting system': proposalPayload.voting_system,
			'voting system options': proposalPayload.voting_system_options
		};
	}
	const typedData: IProposalTypedData = {
		message: {
			description: proposalPayload.description,
			'end date': dayjs(proposalPayload.end_date).format('MMMM D, YYYY h:mm A'),
			house: proposalPayload.house_id,
			room: proposalPayload.room_id,
			'start date': dayjs(proposalPayload.end_date).format('MMMM D, YYYY h:mm A'),
			tags: proposalPayload.tags,
			title: proposalPayload.title,
			'voting system': proposalPayload.voting_system,
			'voting system options': proposalPayload.voting_system_options
		},
		primaryType: 'ProposalPayload',
		types: {
			ProposalPayload: [
				{ name: 'house', type: 'string' },
				{ name: 'room', type: 'string' },
				{ name: 'title', type: 'string' },
				{ name: 'description', type: 'string' },
				{ name: 'tags', type: 'string[]' },
				{ name: 'voting system', type: 'string' },
				{ name: 'voting system options', type: 'VotingSystemOption[]' },
				{ name: 'start date', type: 'string' },
				{ name: 'end date', type: 'string' }
			],
			VotingSystemOption: [
				{ name: 'value', type: 'string' }
			]
		}
	};
	return typedData;
};
