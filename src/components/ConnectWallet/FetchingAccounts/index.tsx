// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import WalletIcon from '~src/ui-components/WalletIcon';
import { EWallet } from '~src/types/enums';
import dynamic from 'next/dynamic';
import { Skeleton } from 'antd';
import { wallets } from '..';

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