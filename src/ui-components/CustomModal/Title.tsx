// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FC } from 'react';
import { ConnectWalletModalTitle } from '~src/components/ConnectWallet';
import { SelectedWalletModalTitle } from '~src/components/ConnectWallet/FetchingAccounts';
import { ETitleType } from '~src/redux/modal/@types';
import { useWalletSelector } from '~src/redux/selectors';

interface IModalTitleProps {
    type?: ETitleType;
}
const ModalTitle: FC<IModalTitleProps> = (props) => {
	const { selectedWallet } = useWalletSelector();
	switch(props.type) {
	case ETitleType.FETCHING_WALLET_ACCOUNTS:
		return <SelectedWalletModalTitle type={selectedWallet} />;
	case ETitleType.CONNECT_WALLET:
		return <ConnectWalletModalTitle />;
	default:
		return <></>;
	}
};

export default ModalTitle;