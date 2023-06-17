// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { WarningOutlined } from '@ant-design/icons';
import React, { FC } from 'react';

interface IConnectWalletBannerProps {
    connectWallet: () => void;
}

const ConnectWalletBanner: FC<IConnectWalletBannerProps> = (props) => {
	return (
		<section className='flex items-center justify-center p-2'>
			<button
				onClick={props.connectWallet}
				className='outline-none border-none text-white bg-blue_primary flex-1 font-medium text-lg flex items-center justify-center rounded-md p-3 cursor-pointer gap-x-2'
			>
				<WarningOutlined />
				<span>Connect Wallet, if you want to comment</span>
			</button>
		</section>
	);
};

export default ConnectWalletBanner;