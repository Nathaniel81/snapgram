import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { useToast } from "../ui/use-toast";

import {
    useDeleteSavedPost,
    useLikePost,
    useSavePost,
    useUnlikePost,
} from "../../lib/react-query/queries";

import { Post } from "../../types";

type PostStatsProps = {
  post: Post;
};


const PostStats = ({ post }: PostStatsProps) => {
  const userLogin = useSelector((state: RootState) => state.user);
  const {
        userInfo: user, 
      } = userLogin;
  const { toast } = useToast();

  const checkIsLiked = (likeList: string[], userId?: string) => {
    if (userId) return likeList.includes(userId)
  };
  const checkIsSaved = (savedList: string[], userId?: string) => {
    if (userId) return savedList.includes(userId)
  };

  const location = useLocation();

  const likesList = post?.likes?.map((userId) => userId);
  const savedList = post?.saved_by?.map((userId) => userId);

  const [likes, setLikes] = useState<string[]>(likesList ?? []);
  const [saved, setSaved] = useState<string[]>(savedList ?? []);

  const { mutate: likePost, error: likeError } = useLikePost();
  const { mutate: unlikePost, error: unlikeError } = useUnlikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();

  if (likeError || unlikeError) return toast({titile: 'An Error Occured. Please try again' })

  const handleLikePost = (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
      e.stopPropagation();
      if (!user) return toast({titile: 'Login to like a post' })
      
      const userIdString = user?.id ?? '';
      
      let likesArray = [...likes];
      if (userIdString && likesArray.includes(userIdString)) {
        likesArray = likesArray.filter((Id) => Id !== userIdString);
        unlikePost({ postId: post.id });
      } else {
        likesArray.push(userIdString);
        likePost({ postId: post.id });
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
      deleteSavedPost({ postId: post.id })
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
