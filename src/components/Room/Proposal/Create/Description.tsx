// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { useProposalCreation } from '~src/redux/room/selectors';
import TextEditor from '~src/ui-components/TextEditor';

const Description = () => {
	const proposalDescription = useProposalCreation();
	const dispatch = useDispatch();
	const timeout = useRef<NodeJS.Timeout>();
	return (
		<div className='flex flex-col'>
			<h3 className='text-white font-medium text-xl'>Description</h3>
			<TextEditor
				initialValue={''}
				value={proposalDescription?.description}
				localStorageKey='new_proposal_description'
				onChange={(v) => {
					clearTimeout(timeout.current);
					timeout.current = setTimeout(() => {
						clearTimeout(timeout.current);
						dispatch(roomActions.setProposalCreation_Field({
							key: 'description',
							value: v
						}));
					}, 1000);
				} }
			/>
		</div>
	);
};

export default Description;