// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { useProposalCreation } from '~src/redux/room/selectors';
import { useRoomSelector } from '~src/redux/selectors';
import TextEditor from '~src/ui-components/TextEditor';
import Description from '../ContentWrapper/Content/Description';

interface IDescriptionProps {
	imageNamePrefix: string;
	value:string;
}

const DescriptionBox: FC<IDescriptionProps> = (props) => {
	const { imageNamePrefix,value } = props;
	const proposalDescription = useProposalCreation();
	const dispatch = useDispatch();
	const timeout = useRef<NodeJS.Timeout>();
	const { loading,isPropsalPreviewState } = useRoomSelector();
	return (
		<div className='flex flex-col'>
			<h3 className='text-white font-medium text-xl'>Description</h3>
			{
				isPropsalPreviewState ?
					<section
						className={`border ${isPropsalPreviewState?'cursor-not-allowed':''} border-solid border-blue_primary rounded-2xl `}
					>
						<div className='py-[18px] px-[25px] flex flex-col gap-y-[14.5px]'>
							<Description
								value={value}
							/>
						</div>
					</section>:
					<TextEditor
					// Description class is for error validation highlighting
						className='description'
						imageNamePrefix={imageNamePrefix}
						initialValue={''}
						isDisabled={loading}
						value={proposalDescription?.description}
						localStorageKey='proposalCreation'
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
			}
		</div>
	);
};

export default DescriptionBox;