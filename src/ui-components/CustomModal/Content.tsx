// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FC } from 'react';
import JoinedRoomsModalContent from '~src/components/AppLayout/JoinedRooms/Modal';
import ConnectWallet from '~src/components/ConnectWallet';
import FetchingAccounts from '~src/components/ConnectWallet/FetchingAccounts';
import HouseRoomsModalContent from '~src/components/House/HouseWrapper/Modal';
import EditHistoryModalContent from '~src/components/Room/Proposal/ContentWrapper/CommentsWrapper/Comments/Comment/Header/EditHistory/ModalContent';
import SentimentModalContent from '~src/components/Room/Proposal/ContentWrapper/CommentsWrapper/CreateComment/Sentiment/Content';
import DiscussionSentimentModalContent from '~src/components/Room/Discussion/ContentWrapper/CommentsWrapper/CreateComment/Sentiment/Content';
import DiscussionEditHistoryModalContent from '~src/components/Room/Discussion/ContentWrapper/CommentsWrapper/Comments/Comment/Header/EditHistory/ModalContent';
import AllVotesModalContent from '~src/components/Room/Proposal/Sidebar/Vote/VoteInfo/All/Modal/Content';
import CastYourVoteModalContent from '~src/components/Room/Proposal/Sidebar/Vote/CastYourVote/Modal/Content';
import { EContentType } from '~src/redux/modal/@types';
import PostLinkModalContent from '~src/components/Room/Proposal/Sidebar/PostLink/Modal/Content';
import DiscussionEditModalContent from '~src/components/Room/Discussion/ContentWrapper/Content/Heading/Edit/Modal/Content';
import ModalStrategyDeleteContent from '~src/components/Room/Settings/Strategies/ModalStrategyDelete/Content';
import ModalStrategyEditContent from '~src/components/Room/Settings/Strategies/ModalStrategyEdit/Content';
import ModalStrategyAddContent from '~src/components/Room/Settings/Strategies/ModalStrategyAdd/Content';
import ModalStrategyThresholdAddContent from '~src/components/Room/Settings/Strategies/ModalThresholdAdd/Content';
import ModalStrategyThresholdEditContent from '~src/components/Room/Settings/Strategies/ModalThresholdEdit/Content';
import ModalStrategyThresholdDeleteContent from '~src/components/Room/Settings/Strategies/ModalThresholdDelete/Content';

interface IModalContentProps {
    type?: EContentType;
}

const ModalContent: FC<IModalContentProps> = (props) => {
	switch(props.type) {
	case EContentType.CONNECT_WALLET:
		return <ConnectWallet />;
	case EContentType.FETCHING_WALLET_ACCOUNTS:
		return <FetchingAccounts />;
	case EContentType.MULTIPLE_JOINED_ROOMS:
		return <JoinedRoomsModalContent />;
	case EContentType.HOUSE_ROOMS:
		return <HouseRoomsModalContent />;
	case EContentType.COMMENT_SENTIMENT:
		return <SentimentModalContent />;
	case EContentType.DISCUSSION_COMMENT_SENTIMENT:
		return <DiscussionSentimentModalContent />;
	case EContentType.COMMENT_EDIT_HISTORY:
		return <EditHistoryModalContent />;
	case EContentType.DISCUSSION_COMMENT_EDIT_HISTORY:
		return <DiscussionEditHistoryModalContent />;
	case EContentType.CAST_YOUR_VOTE:
		return <CastYourVoteModalContent />;
	case EContentType.ALL_VOTES:
		return <AllVotesModalContent />;
	case EContentType.POST_LINK_MODAL:
		return <PostLinkModalContent />;
	case EContentType.DISCUSSION_EDIT_MODAL:
		return <DiscussionEditModalContent />;
	case EContentType.ROOM_STRATEGY_DELETE_MODAL:
		return <ModalStrategyDeleteContent />;
	case EContentType.ROOM_STRATEGY_EDIT_MODAL:
		return <ModalStrategyEditContent />;
	case EContentType.ROOM_STRATEGY_ADD_MODAL:
		return <ModalStrategyAddContent />;
	case EContentType.ROOM_STRATEGY_THRESHOLD_ADD_MODAL:
		return <ModalStrategyThresholdAddContent />;
	case EContentType.ROOM_STRATEGY_THRESHOLD_EDIT_MODAL:
		return <ModalStrategyThresholdEditContent />;
	case EContentType.ROOM_STRATEGY_THRESHOLD_DELETE_MODAL:
		return <ModalStrategyThresholdDeleteContent />;
	default:
		return <></>;
	}
};

export default ModalContent;