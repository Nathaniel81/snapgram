export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    id: string;
    caption: string;
    file: string;
    location?: string;
    tags?: string;
    imageUrl?: URL;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    id: string | undefined;
    name: string;
    username: string;
    email: string;
    profile_picture: string;
    bio: string;
    followers: IUser[];
    following: IUser[];
    friends: IUser[];
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export type IComment = {
    id: number;
    author: IUser;
    content: string;
    parent_comment_id?: number | null;
    post: Post;
    likes_count: number;
    user_liked: boolean;
    created_at?: string;
    updated_at?: string;
  };

  export type Post = {
    id: number;
    creator: IUser;
    caption: string;
    location?: string;
    tags?: string;
    file?: URL;
    createdAt?: string;
    comments: IComment[];
    likes?: string[];
    saved_by?: string[];
  };

  export type ICommentPayload = {
    post: number;
    content: string;
    parent_comment_id?: number | null;
  };

  export type Message = {
    id: string;
    user: IUser;
    message: string;
    room: string;
    timestamp?: string;
  };
