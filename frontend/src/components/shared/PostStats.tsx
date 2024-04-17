import { 
    useState, 
    // useEffect 
} from "react";
import { useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { useToast } from "../ui/use-toast";
// import { IUser } from "../../types";

import { 
    useLikePost,
    // useSavePost,
    // useDeleteSavedPost,
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

  const location = useLocation();

  const likesList = post?.likes?.map((userId) => userId);

  const [likes, setLikes] = useState<string[]>(likesList ?? []);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost, error: likeError } = useLikePost();

  if (likeError) return toast({titile: 'An Error Occured. Please try again' })
//   const { mutate: savePost } = useSavePost();
//   const { mutate: deleteSavePost } = useDeleteSavedPost();


//   const savedPostRecord = currentUser?.save.find(
//     (record: Models.Document) => record.post.$id === post.$id
//   );

//   useEffect(() => {
//     setIsSaved(!!savedPostRecord);
//   }, [currentUser]);

const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!user) return toast({titile: 'Login to like a post' })
    
    const userIdString = user?.id ?? '';
    
    let likesArray = [...likes];
    if (userIdString && likesArray.includes(userIdString)) {
      likesArray = likesArray.filter((Id) => Id !== userIdString);
    } else {
      likesArray.push(userIdString);
    }
    setLikes(likesArray);
    likePost({ postId: post.id });
  };
  

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    // if (savedPostRecord) {
    //   setIsSaved(false);
    //   return deleteSavePost(savedPostRecord.$id);
    // }

    // savePost({ userId: userId, postId: post.$id });
    // setIsSaved(true);
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
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
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
