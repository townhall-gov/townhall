// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FC } from 'react';
import JoinedRoomsModalContent from '~src/components/AppLayout/JoinedRooms/Modal';
import ConnectWallet from '~src/components/ConnectWallet';
import FetchingAccounts from '~src/components/ConnectWallet/FetchingAccounts';
import SentimentModalContent from '~src/components/Room/Proposal/ContentWrapper/CommentsWrapper/CreateComment/Sentiment/Content';
import { EContentType } from '~src/redux/modal/@types';

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
	case EContentType.COMMENT_SENTIMENT:
		return <SentimentModalContent />;
	default:
		return <></>;
	}
};

export default ModalContent;