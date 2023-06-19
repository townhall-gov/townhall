// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { ConnectWalletIcon, ThumbUpIcon } from './CustomIcons';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';

export interface IJoinTownhallProps {
    description: string;
}

const JoinTownhall: FC<IJoinTownhallProps> = (props) => {
	const { description } = props;
	const dispatch = useDispatch();
	return (
		<article
			className='flex flex-col items-center justify-center gap-y-7 rounded-2xl bg-dark_blue_primary min-h-[458px]'
		>
			<ThumbUpIcon className='text-[251px]' />
			<h3 className='m-0 text-white font-medium text-2xl leading-[29px] tracking-[0.01em]'>
				{description}
			</h3>
			<button
				onClick={() => {
					dispatch(modalActions.setModal({
						contentType: EContentType.CONNECT_WALLET,
						footerType: EFooterType.NONE,
						open: true,
						titleType: ETitleType.CONNECT_WALLET
					}));
				}}
				className='outline-none border border-solid rounded-2xl border-blue_primary px-4 py-2 text-medium text-[20px] leading-[24px] bg-transparent text-white font-light cursor-pointer flex items-center gap-x-[10px]'
			>
				<ConnectWalletIcon className='text-2xl text-transparent' />
				Connect Wallet
			</button>
		</article>
	);
};

export default JoinTownhall;