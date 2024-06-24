import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { useToast } from "../ui/use-toast";

import {
    useDeleteSavedPost,
    useLikePost,
    useSavePost,
    useUnlikePost,
} from "../../lib/react-query/queries";

import { Post } from "../../types";
import { resetUserInfo } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";

interface AxiosError extends Error {
  response?: {
    status: number;
  };
}
type PostStatsProps = {
  post: Post;
};


const PostStats = ({ post }: PostStatsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const userLogin = useSelector((state: RootState) => state.user);
  const {
        userInfo: user, 
      } = userLogin;
  const { toast } = useToast();

  // Function to check if a post is liked by the user
  const checkIsLiked = (likeList: string[], userId?: string) => {
    if (userId) return likeList.includes(userId);
  };

  // Function to check if a post is saved by the user
  const checkIsSaved = (savedList: string[], userId?: string) => {
    if (userId) return savedList.includes(userId);
  };

  const location = useLocation();

  const likesList = post?.likes?.map((userId) => userId);
  const savedList = post?.saved_by?.map((userId) => userId);

  const [likes, setLikes] = useState<string[]>(likesList ?? []);
  const [saved, setSaved] = useState<string[]>(savedList ?? []);

  const { mutate: likePost, error: likeErr} = useLikePost();
  const likeError = likeErr as AxiosError;

  const { mutate: unlikePost, error: unlikeErr } = useUnlikePost();
  const unlikeError = unlikeErr as AxiosError;
  
  const { mutate: savePost, error: saveErr } = useSavePost();
  const saveError = saveErr as AxiosError;

  const { mutate: deleteSavedPost, error: deleteErr } = useDeleteSavedPost();
  const deleteError = deleteErr as AxiosError;

  useEffect(() => {
    let likesArray = [...likes];
    if (likeError) {
      likesArray = likesArray.filter((Id) => Id !== user?.id);
      setLikes(likesArray);
      if (likeError.response?.status === 403) {
        toast({title: 'You must be logged in to like a post'});
        dispatch(resetUserInfo());
      } else {
        toast({title: 'An error occurred while liking the post'});
      }
    }
    if (unlikeError) {
      likesArray.push(user?.id ?? '');
      setLikes(likesArray);
      if (unlikeError.response?.status === 403) {
        toast({title: 'You must be logged in to like a post'});
        dispatch(resetUserInfo());
      } else {
        toast({title: 'An error occurred while liking the post'});
      }
    }
    // eslint-disable-next-line
  }, [likeError, unlikeError]);

  useEffect(() => {
    let savedArray = [...saved];
    if (saveError) {
      savedArray = savedArray.filter((Id) => Id !== user?.id);
      setSaved(savedArray);
      if (saveError.response?.status === 403) {
        toast({title: 'You must be logged in to save a post'});
        dispatch(resetUserInfo());
      } else {
        toast({title: 'An error occurred while saving the post'});
      }
    }
    if (deleteError) {
      savedArray.push(user?.id ?? '');
      setSaved(savedArray);
      if (deleteError.response?.status === 403) {
        toast({title: 'You must be logged in to save a post'});
        dispatch(resetUserInfo());
      } else {
        toast({title: 'An error occurred while saving the post'});
      }
    }
    // eslint-disable-next-line
  }, [deleteError, saveError]);


  const handleLikePost = (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
      e.stopPropagation();
      
      const userIdString = user?.id ?? '';
  
      let likesArray = [...likes];
      if (userIdString && likesArray.includes(userIdString)) {
        unlikePost({ postId: post.id });
        likesArray = likesArray.filter((Id) => Id !== userIdString);
      } else {
        likePost({ postId: post.id });
        likesArray.push(userIdString);
      }
      setLikes(likesArray);
    };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    const userIdString = user?.id ?? '';

    let savedArray = [...saved];
    if (userIdString && savedArray.includes(userIdString)) {
      savedArray = savedArray.filter((Id) => Id !== userIdString);
      deleteSavedPost({ postId: post.id });
    } else {
      savedArray.push(userIdString);
      savePost({ postId: post.id });
    }
    setSaved(savedArray);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, user?.id)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={`${
            checkIsSaved(saved, user?.id)
              ? "/assets/icons/saved.svg"
              : "/assets/icons/save.svg"
            }`}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStats;
