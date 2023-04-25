// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import api from '~src/services/api';
import { IConnectBody } from 'pages/api/auth/actions/connect';
import { useWalletSelector } from '~src/redux/selectors';
import { useDispatch } from 'react-redux';
import { walletActions } from '~src/redux/wallet';
import getErrorMessage from '~src/utils/getErrorMessage';
import { profileActions } from '~src/redux/profile';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import classNames from 'classnames';
import { IConnectWalletStartBody, IConnectWalletStartResponse } from 'pages/api/auth/actions/connectStart';
import { signMessage } from './utils';
import { IToken } from '~src/auth/types';
import { getUserFromToken } from '~src/services/auth.service';
import { FC } from 'react';
interface ISelectedWalletModalFooterProps {}

const SelectedWalletModalFooter: FC<ISelectedWalletModalFooterProps> = () => {
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
							const { data: connectStartData, error } = await api.post<IConnectWalletStartResponse, IConnectWalletStartBody>('auth/actions/connectStart', {
								address: selectedAddress
							});
							if (error) {
								dispatch(walletActions.setError(getErrorMessage(error)));
							} else if (!connectStartData) {
								dispatch(walletActions.setError('Something went wrong.'));
							} else {
								const signature = await signMessage(connectStartData.signMessage, selectedAddress);
								const { data, error } = await api.post<IToken, IConnectBody>('auth/actions/connect', {
									address: selectedAddress,
									signature: signature,
									wallet: selectedWallet
								});
								if (error) {
									dispatch(walletActions.setError(getErrorMessage(error)));
								} else if (!data) {
									dispatch(walletActions.setError('Something went wrong.'));
								} else {
									const user = getUserFromToken(data.token);
									dispatch(profileActions.setUser(user));
									dispatch(modalActions.setModal({
										contentType: EContentType.NONE,
										footerType: EFooterType.NONE,
										open: false,
										titleType: ETitleType.NONE
									}));
								}
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

export default SelectedWalletModalFooter;