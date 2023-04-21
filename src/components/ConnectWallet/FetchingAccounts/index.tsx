// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import WalletIcon, { EWallet } from '~src/ui-components/WalletIcon';
import dynamic from 'next/dynamic';
import { Skeleton } from 'antd';
import { wallets } from '..';
import api from '~src/services/api';
import { IUser } from '~src/types/schema';
import { IConnectBody } from 'pages/api/auth/actions/connect';
import { useWalletSelector } from '~src/redux/selectors';
import { useDispatch } from 'react-redux';
import { walletActions } from '~src/redux/wallet';
import getErrorMessage from '~src/utils/getErrorMessage';
import { profileActions } from '~src/redux/profile';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import classNames from 'classnames';

const WalletAccounts = dynamic(() => import('~src/components/ConnectWallet/FetchingAccounts/WalletAccounts'), {
	loading: () => <Skeleton.Avatar active size='large' shape='circle' /> ,
	ssr: false
});

interface ISelectedWalletModalTitleProps {
	type: EWallet | null;
}

export const SelectedWalletModalTitle: FC<ISelectedWalletModalTitleProps> = (props) => {
	return <p className='flex items-center gap-x-2 m-0 p-0'>
		{props.type? <WalletIcon type={props.type} />: null}
		{wallets.find((wallet) => wallet.type === props.type)?.title}{' '}
		accounts
	</p>;
};

interface ISelectedWalletModalFooterProps {}

export const SelectedWalletModalFooter: FC<ISelectedWalletModalFooterProps> = () => {
	const { selectedAddress, selectedWallet, loading } = useWalletSelector();
	const dispatch = useDispatch();
	return (
		<div className='flex items-center justify-end m-0 mt-5 p-0'>
			<button
				onClick={async () => {
					if (!loading) {
						if (!selectedAddress) {
							dispatch(walletActions.setError('Please select an address.'));
							return;
						}
						if (!selectedWallet) {
							dispatch(walletActions.setError('Please select a wallet.'));
							return;
						}
						try {
							dispatch(walletActions.setLoading(true));
							const { data, error } = await api.post<IUser, IConnectBody>('auth/actions/connect', {
								address: selectedAddress,
								wallet: selectedWallet
							});
							if (error) {
								dispatch(walletActions.setError(getErrorMessage(error)));
							} else if (!data) {
								dispatch(walletActions.setError('Something went wrong.'));
							} else {
								dispatch(profileActions.setUser(data));
								dispatch(modalActions.setModal({
									contentType: EContentType.NONE,
									footerType: EFooterType.NONE,
									open: false,
									titleType: ETitleType.NONE
								}));
							}
							dispatch(walletActions.setLoading(false));
						} catch (error) {
							dispatch(walletActions.setLoading(false));
							dispatch(walletActions.setError(getErrorMessage(error)));
						}
					}
				}}
				disabled={loading}
				className={
					classNames('border border-solid border-blue_primary text-white px-6 py-1 rounded-md flex items-center justify-center bg-transparent font-medium', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})
				}
			>
				Connect
			</button>
		</div>
	);
};

interface IFetchingAccountsProps {}
const FetchingAccounts: FC<IFetchingAccountsProps> = () => {
	return (
		<article
			className='flex flex-col items-center gap-y-2 bg-none mt-5'
		>
			<WalletAccounts />
		</article>
	);
};

export default FetchingAccounts;