import {
    useQuery,
    useMutation,
    useQueryClient,
    // useInfiniteQuery,
} from "@tanstack/react-query";
import axios from 'axios';
import { 
  // INewPost, 
  Post 
} from "../../types";

import { QUERY_KEYS } from "./queryKeys";


// Users Queries

const getUsers = async (limit?: number) => {
  const response = await axios.get('/api/user', {
    params: {
      limit,
    },
  });
  return response.data;
};
export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

const signOutAccount = async () => {
  const response = await axios.post('/api/user/logout/');
  localStorage.removeItem('userInfo');
  return response.data;
};
export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};


//Post Queries

// export const createPost = async (post: FormData) => {
//   console.log(post)
//   const config = {
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }
//   const response = await axios.post('/api/post/create/', post, config);
//   return response.data;
// };

// export const useCreatePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (post: FormData) => createPost(post),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//     },
//   });
// };

export const getRecentPosts = async (): Promise<Post[]> => {
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }
  const response = await axios.get<Post[]>('/api/post/recent', config);
  return response.data;
};
export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const likePost = async (postId: string) => {
  const response = await axios.post(`/api/post/${postId}/like/`);
  return response.data;
};
export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
    }: {
      postId: string;
    }) => likePost(postId),
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const unlikePost = async (postId: string) => {
  const response = await axios.post(`/api/post/${postId}/unlike/`);
  return response.data;
};
export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
    }: {
      postId: string;
    }) => unlikePost(postId),
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const savePost = async (postId: string) => {
  const response = await axios.post(`/api/post/${postId}/save/`);
  return response.data;
};
export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) =>
      savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const deleteSavedPost = async (postId: string) => {
  const response = await axios.post(`/api/post/${postId}/unsave/`);
  return response.data;
};
export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) =>
      deleteSavedPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};
