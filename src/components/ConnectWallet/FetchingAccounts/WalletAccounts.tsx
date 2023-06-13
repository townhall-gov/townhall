// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
'use client';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { FC, useEffect } from 'react';
import getAccounts, { getMetamaskAccounts } from '../../../utils/accounts';
import { EWallet } from '~src/types/enums';
import AddressDropdown from '~src/ui-components/AddressDropdown';
import { useDispatch } from 'react-redux';
import { walletActions } from '~src/redux/wallet';
import { useWalletSelector } from '~src/redux/selectors';
import getErrorMessage from '~src/utils/getErrorMessage';

interface IWalletAccountsProps {}

const WalletAccounts: FC<IWalletAccountsProps> = () => {
	const dispatch = useDispatch();
	const { walletsAddresses, selectedWallet, error, loading } = useWalletSelector();

	const fetchAccounts = async () => {
		try {
			if (!selectedWallet) {
				dispatch(walletActions.setError('Wallet is not selected.'));
				return;
			}
			dispatch(walletActions.setLoading(true));
			dispatch(walletActions.setError(null));
			const { accounts, error } = ((selectedWallet === EWallet.POLKADOT_JS)? await getAccounts(EWallet.POLKADOT_JS): await getMetamaskAccounts());
			const filteredAccounts = accounts.filter((account) => !!account?.address);
			const addresses = filteredAccounts.map((account) => account?.address);
			dispatch(walletActions.setWalletsAddresses({
				[selectedWallet]: addresses
			}));
			if (addresses.length > 0) {
				dispatch(walletActions.setSelectedAddress(addresses[0]));
			}
			dispatch(walletActions.setLoading(false));
			dispatch(walletActions.setError(error));
		} catch (error) {
			dispatch(walletActions.setLoading(false));
			dispatch(walletActions.setError(getErrorMessage(error)));
		}
	};

	useEffect(() => {
		fetchAccounts();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!selectedWallet) {
		return <div className='w-full'>
			<p className='flex items-center justify-center m-0 text-red-500 font-semibold text-lg'>Please select a wallet.</p>
		</div>;
	}

	return (
		<div className='w-full'>
			<Spin className='bg-[#04152F]' spinning={loading} indicator={<LoadingOutlined />}>
				<div className='flex flex-col gap-y-2'>
					{error? <>
						<div className='flex flex-col items-center gap-y-2'>
							<p className='text-lg font-medium text-red-500'>{error}</p>
							<button
								onClick={async () => await fetchAccounts()} className='outline-none px-5 py-1 bg-transparent max-w-[150px] border border-solid border-blue_primary rounded-md text-base font-medium text-white flex items-center justify-center cursor-pointer'
							>
								Refetch
							</button>
						</div>
					</>:
						walletsAddresses?.[selectedWallet]?.length > 0?
							<>
								<label htmlFor="addressDropdown" className='text-base font-medium'>Select an address</label>
								<AddressDropdown
									addresses={walletsAddresses?.[selectedWallet] || []}
									onAddressChange={(value) => {
										dispatch(walletActions.setSelectedAddress(value));
									}}
								/>
							</>
							: <p className='text-lg font-medium text-red-500'>
								No accounts found
							</p>

					}
				</div>
			</Spin>
		</div>
	);
};

export default WalletAccounts;