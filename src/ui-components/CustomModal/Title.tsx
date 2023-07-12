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
import DiscussionEditModalTitle from '~src/components/Room/Discussion/ContentWrapper/Content/Heading/Edit/Modal/Title';
import ModalStrategyDeleteTitle from '~src/components/Room/Settings/Strategies/ModalStrategyDelete/Title';
import ModalStrategyEditTitle from '~src/components/Room/Settings/Strategies/ModalStrategyEdit/Title';
import ModalStrategyAddTitle from '~src/components/Room/Settings/Strategies/ModalStrategyAdd/Title';
import ModalThresholdAddTitle from '~src/components/Room/Settings/Strategies/ModalThresholdAdd/Title';
import ModalStrategyThresholdEditTitle from '~src/components/Room/Settings/Strategies/ModalThresholdEdit/Title';
import ModalStrategyThresholdDeleteTitle from '~src/components/Room/Settings/Strategies/ModalThresholdDelete/Title';
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
	case ETitleType.DISCUSSION_EDIT_MODAL:
		return <DiscussionEditModalTitle />;
	case ETitleType.ROOM_STRATEGY_DELETE_MODAL:
		return <ModalStrategyDeleteTitle />;
	case ETitleType.ROOM_STRATEGY_EDIT_MODAL:
		return <ModalStrategyEditTitle />;
	case ETitleType.ROOM_STRATEGY_ADD_MODAL:
		return <ModalStrategyAddTitle />;
	case ETitleType.ROOM_STRATEGY_THRESHOLD_ADD_MODAL:
		return <ModalThresholdAddTitle />;
	case ETitleType.ROOM_STRATEGY_THRESHOLD_EDIT_MODAL:
		return <ModalStrategyThresholdEditTitle />;
	case ETitleType.ROOM_STRATEGY_THRESHOLD_DELETE_MODAL:
		return <ModalStrategyThresholdDeleteTitle />;
	default:
		return <></>;
	}
};

export default ModalTitle;