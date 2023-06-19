// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PlusOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useState } from 'react';
import { useProposalCreation } from '~src/redux/room/selectors';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import classNames from 'classnames';
import { useRoomSelector } from '~src/redux/selectors';
import { CancelIcon } from '~src/ui-components/CustomIcons';

interface ISingleChoiceVotingProps {
    className?: string;
}

const SingleChoiceVoting:FC<ISingleChoiceVotingProps> = (props) => {
	const { className } = props;
	const { loading,isPropsalPreviewState } = useRoomSelector();
	const { voting_system_options } = useProposalCreation();
	const dispatch = useDispatch();
	const [inputWidthindex, setInputWidthindex] = useState<number[]>([]);
	useEffect(() => {
		if (!voting_system_options || !Array.isArray(voting_system_options) || !voting_system_options.length) {
			dispatch(roomActions.setProposalCreation_Field({
				key: 'voting_system_options',
				value: [
					{
						value: ''
					}
				]
			}));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const isDisabled = voting_system_options.some((option: { value: any; }) => !option.value) || loading ;
	return (
		<div
			className='flex flex-col gap-y-2'
		>
			{voting_system_options.map((option, i) => {
				return (
					<article key={i}
						className={`flex items-center gap-x-2 ${inputWidthindex.includes(i)? 'w-full':'w-[66vw]'}`}
					>
						<div
							className={classNames(`flex-1 flex border border-solid border-blue_primary rounded-md py-2 px-4 gap-x-2 voting_system_option_${i}`,className)}
						>
							<span className='text-grey_light py-1'>Choice {i + 1}</span>
							<input
								disabled={loading||isPropsalPreviewState}
								onChange={(e) => {
									dispatch(roomActions.setProposalCreation_Field({
										key: 'voting_system_options',
										value: voting_system_options.map((option, j) => {
											if (i === j) {
												return {
													...option,
													value: e.target.value
												};
											}
											return option;
										})
									}));
								}}
								value={option.value}
								className='border-none outline-none flex items-center flex-1 bg-transparent text-white p-1'
								placeholder='Enter choice'
							/>
							{<div onClick={() => {dispatch(roomActions.setProposalCreation_Field({
								key: 'voting_system_options',
								value: voting_system_options.map((option, j) => {
									if (i === j) {
										return {
											...option,
											value: ''
										};
									}
									return option;
								})
							}));}}>
								{
									option.value && !isPropsalPreviewState  && <CancelIcon className='text-transparent  stroke-app_background text-2xl'/>
								}
							</div>}
						</div>
						<button
							disabled={isDisabled||isPropsalPreviewState}
							className={
								classNames('w-10 h-10 -mr-10 flex items-center justify-center border border-solid border-blue_primary outline-none bg-transparent text-blue_primary rounded-full', {
									'cursor-not-allowed': isDisabled,
									'cursor-pointer': !isDisabled,
									'invisible': i !== voting_system_options.length - 1
								})
							}
							onClick={() => {
								if (!isDisabled) {
									dispatch(roomActions.setProposalCreation_Field({
										key: 'voting_system_options',
										value: voting_system_options.concat({
											value: ''
										})
									}));
									setInputWidthindex(prevState => [...prevState, i]);
								}
							}}
						>
							<PlusOutlined />
						</button>
					</article>
				);
			})}
		</div>
	);
};

export default SingleChoiceVoting;