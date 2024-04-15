import {
    useQuery,
    useMutation,
    useQueryClient,
    // useInfiniteQuery,
} from "@tanstack/react-query";
import axios from 'axios';
import { INewPost } from "../../types";

import { QUERY_KEYS } from "./queryKeys";

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



export const createPost = async (post: INewPost) => {
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }
  const response = await axios.post('/api/post/create/', post, config);
  return response.data;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};