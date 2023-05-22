// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FC } from 'react';
import { JoinedRoomsModalTitle } from '~src/components/AppLayout/JoinedRooms/Modal';
import { ConnectWalletModalTitle } from '~src/components/ConnectWallet';
import { SelectedWalletModalTitle } from '~src/components/ConnectWallet/FetchingAccounts';
import EditHistoryModalTitle from '~src/components/Room/Proposal/ContentWrapper/CommentsWrapper/Comments/Comment/Header/EditHistory/ModalTitle';
import CastYourVoteModalTitle from '~src/components/Room/Proposal/Sidebar/Vote/CastYourVote/Modal/Title';
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
	case ETitleType.MULTIPLE_JOINED_ROOMS:
		return <JoinedRoomsModalTitle />;
	case ETitleType.COMMENT_EDIT_HISTORY:
		return <EditHistoryModalTitle />;
	case ETitleType.CAST_YOUR_VOTE:
		return <CastYourVoteModalTitle />;
	default:
		return <></>;
	}
};

export default ModalTitle;