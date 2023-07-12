// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Skeleton } from 'antd';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import EditHistoryModalFooter from '~src/components/Room/Proposal/ContentWrapper/CommentsWrapper/Comments/Comment/Header/EditHistory/ModalFooter';
import SentimentModalFooter from '~src/components/Room/Proposal/ContentWrapper/CommentsWrapper/CreateComment/Sentiment/Footer';
import DiscussionSentimentModalFooter from '~src/components/Room/Discussion/ContentWrapper/CommentsWrapper/CreateComment/Sentiment/Footer';
import DiscussionEditHistoryModalFooter from '~src/components/Room/Discussion/ContentWrapper/CommentsWrapper/Comments/Comment/Header/EditHistory/ModalFooter';
import { EFooterType } from '~src/redux/modal/@types';
import PostLinkModalFooter from '~src/components/Room/Proposal/Sidebar/PostLink/Modal/Footer';
import DiscussionEditModalFooter from '~src/components/Room/Discussion/ContentWrapper/Content/Heading/Edit/Modal/Footer';
import ModalStrategyDeleteFooter from '~src/components/Room/Settings/Strategies/ModalStrategyDelete/Footer';
import ModalStrategyEditFooter from '~src/components/Room/Settings/Strategies/ModalStrategyEdit/Footer';
import ModalThresholdAddFooter from '~src/components/Room/Settings/Strategies/ModalThresholdAdd/Footer';
import ModalStrategyThresholdEditFooter from '~src/components/Room/Settings/Strategies/ModalStrategyEdit/Footer';
import ModalStrategyThresholdDeleteFooter from '~src/components/Room/Settings/Strategies/ModalThresholdDelete/Footer';
interface IModalFooterProps {
    type?: EFooterType;
}

const SelectedWalletModalFooter = dynamic(() => import('~src/components/ConnectWallet/FetchingAccounts/Footer'), {
	loading: () => <Skeleton.Avatar active size='large' shape='circle' /> ,
	ssr: false
});

const CastYourVoteModalFooter = dynamic(() => import('~src/components/Room/Proposal/Sidebar/Vote/CastYourVote/Modal/Footer'), {
	loading: () => <Skeleton.Avatar active size='large' shape='circle' /> ,
	ssr: false
});

const ModalFooter: FC<IModalFooterProps> = (props) => {
	switch(props.type) {
	case EFooterType.FETCHING_WALLET_ACCOUNTS:
		return <SelectedWalletModalFooter />;
	case EFooterType.COMMENT_SENTIMENT:
		return <SentimentModalFooter />;
	case EFooterType.DISCUSSION_COMMENT_SENTIMENT:
		return <DiscussionSentimentModalFooter />;
	case EFooterType.COMMENT_EDIT_HISTORY:
		return <EditHistoryModalFooter />;
	case EFooterType.DISCUSSION_COMMENT_EDIT_HISTORY:
		return <DiscussionEditHistoryModalFooter />;
	case EFooterType.CAST_YOUR_VOTE:
		return <CastYourVoteModalFooter />;
	case EFooterType.POST_LINK_MODAL:
		return <PostLinkModalFooter />;
	case EFooterType.DISCUSSION_EDIT_MODAL:
		return <DiscussionEditModalFooter />;
	case EFooterType.ROOM_STRATEGY_DELETE_MODAL:
		return <ModalStrategyDeleteFooter />;
	case EFooterType.ROOM_STRATEGY_EDIT_MODAL:
		return <ModalStrategyEditFooter />;
	case EFooterType.ROOM_STRATEGY_THRESHOLD_ADD_MODAL:
		return <ModalThresholdAddFooter />;
	case EFooterType.ROOM_STRATEGY_THRESHOLD_EDIT_MODAL:
		return <ModalStrategyThresholdEditFooter />;
	case EFooterType.ROOM_STRATEGY_THRESHOLD_DELETE_MODAL:
		return <ModalStrategyThresholdDeleteFooter />;
	default:
		return <></>;
	}
};

export default ModalFooter;