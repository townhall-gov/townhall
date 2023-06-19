// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FC } from 'react';
import { JoinedRoomsModalTitle } from '~src/components/AppLayout/JoinedRooms/Modal';
import { ConnectWalletModalTitle } from '~src/components/ConnectWallet';
import { SelectedWalletModalTitle } from '~src/components/ConnectWallet/FetchingAccounts';
import { HouseRoomsModalTitle } from '~src/components/House/HouseWrapper/Modal';
import EditHistoryModalTitle from '~src/components/Room/Proposal/ContentWrapper/CommentsWrapper/Comments/Comment/Header/EditHistory/ModalTitle';
import DiscussionEditHistoryModalTitle from '~src/components/Room/Discussion/ContentWrapper/CommentsWrapper/Comments/Comment/Header/EditHistory/ModalTitle';
import AllVotesModalTitle from '~src/components/Room/Proposal/Sidebar/Vote/VoteInfo/All/Modal/Title';
import CastYourVoteModalTitle from '~src/components/Room/Proposal/Sidebar/Vote/CastYourVote/Modal/Title';
import { ETitleType } from '~src/redux/modal/@types';
import { useWalletSelector } from '~src/redux/selectors';
import PostLinkModalTitle from '~src/components/Room/Proposal/Sidebar/PostLink/Modal/Title';

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
	case ETitleType.HOUSE_ROOMS:
		return <HouseRoomsModalTitle />;
	case ETitleType.COMMENT_EDIT_HISTORY:
		return <EditHistoryModalTitle />;
	case ETitleType.DISCUSSION_COMMENT_EDIT_HISTORY:
		return <DiscussionEditHistoryModalTitle />;
	case ETitleType.CAST_YOUR_VOTE:
		return <CastYourVoteModalTitle />;
	case ETitleType.ALL_VOTES:
		return <AllVotesModalTitle />;
	case ETitleType.POST_LINK_MODAL:
		return <PostLinkModalTitle />;
	default:
		return <></>;
	}
};

export default ModalTitle;