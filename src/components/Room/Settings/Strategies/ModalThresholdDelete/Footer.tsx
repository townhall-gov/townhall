// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Divider } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { roomActions } from '~src/redux/room';
import { useRoomSelector } from '~src/redux/selectors';

const ModalStrategyThresholdDeleteFooter = () => {
	const dispatch = useDispatch();
	const { strategyThresholdIdTobeDeleted } = useRoomSelector();
	return (
		<>
			<Divider className='bg-blue_primary' />
			<footer
				className='flex items-center justify-end flex-1 w-full gap-1 '
			>
				<button
					className={
						classNames('bg-transparent cursor-pointer text-white border border-solid border-blue_primary rounded-lg py-1 px-5 font-medium text-sm')
					}
					onClick={() => {
						dispatch(modalActions.setModal({
							contentType: EContentType.NONE,
							footerType: EFooterType.NONE,
							open: false,
							titleType: ETitleType.NONE
						}));
					}}
				>
                    Cancel
				</button>
				<button
					className={
						classNames('text-white border cursor-pointer border-solid border-blue_primary rounded-lg py-1 px-5 font-medium text-sm bg-blue_primary')
					}
					onClick={() => {
						dispatch(roomActions.setRoomSettingsStrategyThresoldDelete(strategyThresholdIdTobeDeleted));
						dispatch(modalActions.setModal({
							contentType: EContentType.NONE,
							footerType: EFooterType.NONE,
							open: false,
							titleType: ETitleType.NONE
						}));
					}}
				>
                    Confirm
				</button>
			</footer>
		</>
	);
};

export default ModalStrategyThresholdDeleteFooter;