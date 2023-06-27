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
	default:
		return <></>;
	}
};

export default ModalContent;