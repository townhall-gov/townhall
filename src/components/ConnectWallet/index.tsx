// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { EWallet } from '~src/types/enums';
import WalletBtn from './WalletBtn';
import { useDispatch } from 'react-redux';
import { walletActions } from '~src/redux/wallet';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';

interface IConnectWalletProps {}

export const wallets = [
	{
		title: 'Polkadot.js',
		type: EWallet.POLKADOT_JS
	},
	{
		title: 'Metamask',
		type: EWallet.METAMASK
	}
];

interface IConnectWalletModalTitleProps {}

export const ConnectWalletModalTitle: FC<IConnectWalletModalTitleProps> = () => {
	return <>Connect Wallet</>;
};

const ConnectWallet: FC<IConnectWalletProps> = () => {
	const dispatch = useDispatch();
	return (
		<article className='flex flex-col items-center gap-y-2 mt-5'>
			{
				wallets.map((wallet) => {
					return (
						<WalletBtn
							className='flex-1 border border-solid border-grey_secondary rounded-[23px] min-h-[46px] w-full hover:border-blue_primary'
							key={wallet.title}
							onClick={() => {
								dispatch(walletActions.setSelectedWallet(wallet.type));
								dispatch(modalActions.setModal({
									contentType: EContentType.FETCHING_WALLET_ACCOUNTS,
									footerType: EFooterType.FETCHING_WALLET_ACCOUNTS,
									open: true,
									titleType: ETitleType.FETCHING_WALLET_ACCOUNTS
								}));
							}}
							{...wallet}
						/>
					);
				})
			}
		</article>
	);
};

export default ConnectWallet;