// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { ConnectWalletIcon } from '~src/ui-components/CustomIcons';

interface IConnectWalletBtnProps {}
const ConnectWalletBtn: FC<IConnectWalletBtnProps> = () => {
	const dispatch = useDispatch();
	return (
		<button
			onClick={() => {
				dispatch(modalActions.setModal({
					contentType: EContentType.CONNECT_WALLET,
					footerType: EFooterType.NONE,
					open: true,
					titleType: ETitleType.CONNECT_WALLET
				}));
			}}
			className='outline-none rounded-2xl border-2 border-solid border-blue_primary flex items-center justify-center py-2 px-4 h-[40px] bg-transparent text-white font-light text-xl leading-[24px] cursor-pointer'
		>
			<div className='flex items-center gap-x-2'>
				<ConnectWalletIcon className='text-2xl text-transparent' />
				<span>
					Connect Wallet
				</span>
			</div>
		</button>
	);
};

export default ConnectWalletBtn;