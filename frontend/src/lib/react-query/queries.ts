import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
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
}
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


export const getPostById = async (postId: string) => {
  const response = await axios.get(`/api/post/${postId}/`);
  return response.data;
};
export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId,
  });
};

export const deletePost = async (postId?: string) => {
  const response = await axios.delete(`/api/post/${postId}/`);
  return response.data;
};
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId?: string; }) =>
      deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};


export const getUserPosts = async (userId: string) => {
  const response = await axios.get(`/api/post/user/${userId}/`);
  return response.data;
};
export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId!),
    enabled: !!userId,
  });
};


const INFINITE_SCROLL_PAGINATION_RESULTS = 6;
export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: async ({ pageParam = 1 }) => {
      const query =
          `/api/post?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`
      const { data } = await axios.get(query);
      return data;
  },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length + 1;
      }
  },
  });
};

export const searchPosts = async (searchTerm: string) => {
  const response = await axios.get(`/api/post/search?query=${searchTerm}`);
  return response.data;
};
export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
}


export const savedPosts = async () => {
  const response = await axios.get(`/api/post/saved`);
  return response.data;
};
export const useSavedPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
    queryFn: () => savedPosts(),
  });
}

export const likedPosts = async () => {
  const response = await axios.get(`/api/post/liked`);
  return response.data;
};
export const useLikedPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIKED_POSTS],
    queryFn: () => likedPosts(),
  });
}
