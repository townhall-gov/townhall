// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import firestore_db from '.';

const userCollection = firestore_db.collection('users');
const houseCollection = firestore_db.collection('houses');
const roomCollection = (houseId: string) => houseCollection.doc(houseId).collection('rooms');
const proposalCollection = (houseId: string, roomId: string) => roomCollection(houseId).doc(roomId).collection('proposals');
const discussionCollection = (houseId: string, roomId: string) => roomCollection(houseId).doc(roomId).collection('discussions');
const voteCollection = (houseId: string, roomId: string, proposalId: string) => proposalCollection(houseId, roomId).doc(proposalId).collection('votes');
const reactionsCollection = (houseId: string, roomId: string, proposalId: number) => proposalCollection(houseId, roomId).doc(String(proposalId)).collection('reactions');
const proposalCommentCollection = (houseId: string, roomId: string, proposalId: number) => proposalCollection(houseId, roomId).doc(String(proposalId)).collection('comments');
const discussionCommentCollection = (houseId: string, roomId: string, proposalId: number) => discussionCollection(houseId, roomId).doc(String(proposalId)).collection('comments');
const joinedHouseCollection = (address: string) => userCollection.doc(address).collection('joined_houses');
const joinedRoomCollection = (address: string, houseId: string) => joinedHouseCollection(address).doc(houseId).collection('joined_rooms');

export {
	houseCollection,
	userCollection,
	joinedHouseCollection,
	joinedRoomCollection,
	roomCollection,
	proposalCollection,
	voteCollection,
	reactionsCollection,
	proposalCommentCollection,
	discussionCollection,
	discussionCommentCollection
};