// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
const messages = {
	// no parameters
	ADDRESS_LOGIN_INVALID_SIGNATURE: 'Connect wallet failed. Invalid signature.',
	INVALID_ADDRESS_IN_JWT: 'Invalid address in token.',
	INVALID_JWT: 'Invalid token. Please connect your wallet again.',
	MISSING_PARAM:'Missing body params.',
	NOT_THE_PROPOSER:'You are not the proposer of this post.',
	SUCCESS: 'Success.',
	UNAUTHORISED: 'Unauthorised.',
	UNAUTHORISED_VOTE: 'You are not allowed to link the post.',
	POST_NOT_FOUND:'Post not found.',
	POST_ALREADY_LINKED:'Post already linked.',
	STRATEGIES_LENGTH: 'Strategies must be less than 8 in a Room.',
	UNABLE_TO_VOTE_STRATEGIES:'Can not vote, All Strategies are not satisfy.',

	// functional contants
	// single parameter
	ALREADY_POST_LINK:(id:number) => `Post with id ${id} already has a post link.`,
	ALREADY_VOTED:(voter_address:string) => `Voter ${voter_address} already voted for this proposal.`,
	INVALID_ID:(type:string) => `Invalid ${type}Id`,
	INVALID_REQ_METHOD:(type:string) => `Invalid request method, ${type} required.`,
	INVALID_TYPE:(type:string) =>  `Invalid ${type}`,
	LOGGED_IN_ADDRESS_DOES_NOT_MATCH:(type:string) => `LoggedIn address is not matching with ${type} address`,
	MORE_THAN_ONE_REACTION:(user_address:string) => `More than one reaction with user address "${user_address}" exists.`,
	NO_VOTING_ROOM_STRATEGY:(room_id:string) => `Room with id ${room_id} does not have any voting strategies.`,
	TYPE_MUST_BE_GREATER_THAN:(type:string) => `${type} content must be greater than 5 characters.`,
	UNABLE_TO_EDIT_CONTENT_SAME:(type:string) => `Unable to edit ${type} as content is same.`,
	UNABLE_TO_UNLINK_ANYPOST:(post_id:number) => `Unable to unlink, as post "${post_id}" is not linked with any post.`,
	UNABLE_TO_EDIT_POSTLINK:(post_id:number) => `Unable to edit post_link, as post "${post_id}" is not linked with any post.`,
	UNABLE_TO_FIND_ROOM_DATA:(roomId:string) => `Data of Room with id ${roomId} is not found.`,
	UNABLE_TO_CREATE_TYPE:(type:string) => `Unable to create a ${type}, insufficient information for creating a ${type}.`,
	UNABLE_TO_ADD_REACTION:(comment_id:string) => `Unable to add the reaction for a Comment "${comment_id}" because it is deleted.`,

	// two parameter
	ALREADY_POST_LINK_WITH:(id:number,id2:number) => `Post "${id}" is already linked with "${id2}".`,
	COMMENT_DELETED:(action:string, reply_id:string) => `Unable to ${action} the reaction for a Reply "${reply_id}" because comment is deleted.`,
	TYPE1_NOT_AVAILABLE:(type1:string,type2:string) => `${type1} is not available, unable to find ${type2}.`,
	TYPE_ALREADY_JOINED:(type:string,id:string) => `${type} with id ${id} is already joined.`,
	TYPE_ALREADY_LEFT:(type:string,id:string) => `${type} with id ${id} already left.`,
	TYPE_NOT_JOINED:(type:string,id:string) => `${type} with id ${id} is not joined.`,
	TYPE_NOT_FOUND:(type:string,id:string) => `${type} with ${id}" is not found.`,
	UNABLE_TO_GET_SNAPSHOT_HEIGHT:(room_id:string,house_id:string) => `Unable to get snapshot heights for a Room with id ${room_id} and a House with id ${house_id}.`,
	UNABLE_TO_UNLINK:(id1:number,id2:number) => `Unable to unlink, as post "${id1}" is not linked with post "${id2}".`,
	UNABLE_TO_TYPE1_DUE_TYPE2:(type1:string,type2:string) => `Unable to ${type1}, ${type2}`,

	// more than two parameters
	REPLY_NOT_FOUND:(reply_id:string,comment_id:string,post_id:number,room_id:string,house_id:string) => `Reply "${reply_id}" is not found for a Comment "${comment_id}" of a Post "${post_id}" in a Room "${room_id}" and a House "${house_id}".`,
	ONLY_ACTION_OF_TYPE:(action?:string,type?:string,action2?:string) => `Only the ${action} of the ${type} can ${action2} it.`,
	TYPE_ALREADY_IN_ROOM_AND_HOUSE:(type:string,id:number|string,room_id:string,house_id:string) => `${type} "${id}" already exists in a Room "${room_id}" and a House "${house_id}".`,
	TYPE_NOT_FOUND_IN_ROOM_AND_HOUSE:(type:string,id:number|string,room_id:string,house_id:string) => `${type} "${id}" is not found in a Room "${room_id}" and a House "${house_id}".`,
	TYPE1_NOT_FOUND_IN_TYPE2:(type1:string,id1:string|number,type2:string,id2:number|string) => `${type1} "${id1}" is not found for ${type2} "${id2}".`,
	UNABLE_TO_FIND_COMMENT_FOR_POST:(comment_id:string,post_id:number,room_id:string,house_id:string) => `Comment "${comment_id}" is not found for a Post "${post_id}" in a Room "${room_id}" and a House "${house_id}".`
};
export default messages;