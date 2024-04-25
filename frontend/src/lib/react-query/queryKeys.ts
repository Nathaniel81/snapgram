export enum QUERY_KEYS {
	// AUTH KEYS
	CREATE_USER_ACCOUNT = "createUserAccount",
  
	// USER KEYS
	GET_CURRENT_USER = "getCurrentUser",
	GET_USERS = "getUsers",
	GET_USER_BY_ID = "getUserById",
	FOLLOW_USER_TOGGLE = "followUserToggle",
  
	// POST KEYS
	GET_POSTS = "getPosts",
	GET_INFINITE_POSTS = "getInfinitePosts",
	GET_RECENT_POSTS = "getRecentPosts",
	GET_POST_BY_ID = "getPostById",
	GET_USER_POSTS = "getUserPosts",
	GET_SAVED_POSTS = "getSavedPosts",
	GET_LIKED_POSTS = "getLikedPosts",
	GET_FILE_PREVIEW = "getFilePreview",
	GET_SEARCHED_USERS="getSearchedUsers",

	GET_ROOM_MESSAGES = "getRoomMessages",
  
	//  SEARCH KEYS
	SEARCH_POSTS = "getSearchPosts",
  }
