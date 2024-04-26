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
    id: string;
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
  
  export type Post = {
    id: string;
    creator: IUser;
    caption: string;
    location?: string;
    tags?: string;
    file?: URL;
    createdAt?: string;
    comments: string[];
    likes?: string[];
    saved_by?: string[];
  };

  export type Message = {
    id: string;
    user: IUser;
    message: string;
    room: string;
    timestamp?: string;
  };
