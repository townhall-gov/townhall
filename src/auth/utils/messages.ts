// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const messages = {
	ADDRESS_LOGIN_INVALID_SIGNATURE: 'Connect wallet failed. Invalid signature.',
	COMMENT_CONTENT_LENGTH: 'Comment content must be greater than 5 characters.',
	COMMENT_NOT_FOUND: (commentId: string, postId: number) => `Comment "${commentId}" is not found for post "${postId}".`,
	COMMENT_NOT_FOUND_HOUSE: (commentId: string, postId: number , roomId: string , houseId:string  ) => `Comment "${commentId}" is not found for a Post "${postId}" in a Room "${roomId}" and a House "${houseId}".` ,
	DISCUSSION_ALREADY_EXIST:(newID:number,room_id:string,house_id:string) => `Discussion "${newID}" already exists in a Room "${room_id}" and a House "${house_id}".`,
	DISCUSSION_DOES_NOT_EXIT_IN_ROOM:(discussion_id:number,room_id:string) => `Discussion "${discussion_id}" does not exist in a Room "${room_id}".`,
	HOUSE_DOES_NOT_EXIST:(house_id:string) => `House "${house_id}" does not exist.`,
	INSUFFICIENT_BALANCE_FOR_PROPOSAL:'Unable to create a proposal, insufficient information for creating a proposal.',
	INSUFFICIENT_COMMENT_INFO:'Unable to create a discussion, insufficient information for creating a discussion.',
	INVALID_ADDRESS: 'Invalid address.',
	INVALID_ADDRESS_IN_JWT: 'Invalid address in token.',
	INVALID_API_ACTION_TYPE: 'Invalid API action type.',
	INVALID_COMMENT_ID: 'Comment ID is invalid.',
	INVALID_COMMENT_SENTIMENT: 'Comment sentiment is invalid.',
	INVALID_GET_REQUEST:'Invalid request method, GET required.',
	INVALID_HOUSE_ID:'Invalid house ID.',
	INVALID_JWT: 'Invalid token. Please connect your wallet again.',
	INVALID_POST_ID: 'Invalid post ID.',
	INVALID_POST_REQUEST:'Invalid request method, POST required.',
	INVALID_POST_TYPE:'Invalid post type.',
	INVALID_PROPOSAL_ID:'Invalid proposalId.',
	INVALID_REPLY_ID:'Invalid replyId.',
	INVALID_ROOM_DETAILS:'Invalid room details.',
	INVALID_ROOM_ID: 'Invalid room ID.',
	INVALID_SIGNATURE:'Invalid signature.',
	INVALID_TOKEN: 'Invalid token.',
	INVALID_WALLET:'Invalid wallet.',
	LOGGED_IN_ADDRESS_DID_NOT_MATCH:'LoggedIn address is not matching with Proposer address',
	MORE_THAN_ONE_USER_ADDRESS:(user_address:string) => `More than one reaction with user address "${user_address}" exists.`,
	ONLY_HOUSE_ADMIN_CAN_EDIT_HOUSE_SETTINGS:'Only house admin can update house settings.',
	ONLY_POSTER_CAN_EDIT:'Only the proposer of the discussion can edit it.',
	POST_NOT_FOUND: (postId: number, roomId: string, houseId: string) =>
		`Post "${postId}" is not found in Room "${roomId}" and House "${houseId}".`,
	ROOM_ALREADY_EXIST_IN_HOUSE:(id:string,house_id:string) => `Room ${id} is already exists in a house ${house_id}.`,
	ROOM_ALREADY_JOINED:(roomId:string) => `Room with id ${roomId} is already joined.`,
	ROOM_ALREADY_LEAVED:(roomId:string) => `Room with id ${roomId} is already leaved.`,
	ROOM_DOES_NOT_EXIST_IN_HOUSE:(room_id:string,house_id:string) => `Room "${room_id}" does not exist in a House "${house_id}".`,
	ROOM_IS_NOT_JOINED:(roomId:string) => ` Room with id ${roomId} is not joined.`,
	ROOM_NOT_FOUND_IN_HOUSE:(roomId:string,houseId:string) => `Room with id ${roomId} is not found in a house with id ${houseId}.`,
	SUCCESS: 'Success.',
	UNABLE_TO_ADD_REACT_FOR_COMMENT:( comment_id:string ) => `Unable to add the reaction for a Comment "${comment_id}" because it is deleted.`,
	UNABLE_TO_EDIT_COMMENT:'Unable to edit comment as content is same.',
	UNAUTHORISED: 'Unauthorized.'

};

export default messages;