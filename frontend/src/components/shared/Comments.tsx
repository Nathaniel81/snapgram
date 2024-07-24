import { 
  SyntheticEvent,
  useState,
  useEffect,
  useRef
} from "react";
import { IComment } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useCreateComment, useLikeComment } from "../../lib/react-query/queries";
import { Post } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { useOnClickOutside } from "../../hooks/use-on-click-outside";
import { multiFormatDateString } from "../../lib/utils";

type PostCommentProps = {
    post: Post;
};


const Comments = ({ post }: PostCommentProps) => {  
  const userLogin = useSelector((state: RootState) => state.user);
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const { 
      userInfo: user, 
    } = userLogin;

  const [commentState, setCommentState] = useState<IComment[]>(post?.comments);
  const commentRef = useRef(null);
  const [content, setContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [activeReply, setActiveReply] = useState<number | null>(null);
  const { mutate: createComment } = useCreateComment();
  const { mutate: likeComment } = useLikeComment();
  const [visibleReplies, setVisibleReplies] = useState<{ [key: number]: boolean }>({});

  useOnClickOutside(commentRef, () => {
    setActiveReply(null);
  })
  
  const previousCommentsRef = useRef<IComment[]>(commentState);
  const previousCommentsLikeRef = useRef<number[]>(likedComments);
  const { toast } = useToast();

  useEffect(() => {
    if (post && post.comments) {
      const likedCommentIds = post.comments.filter(
        comment => comment.user_liked
      ).map(comment => comment.id);
      setLikedComments(likedCommentIds);
      setCommentState(post.comments);
      previousCommentsLikeRef.current = likedCommentIds;
    }
  }, [post]);

  const handleComment = (e: SyntheticEvent, parent_comment_id: number | null = null) => {
    e.preventDefault();
    if (!user || (!content && !replyContent)) return;

    previousCommentsRef.current = commentState;
    const commentContent = parent_comment_id ? replyContent : content;
    const temporaryId = Math.random();
    const createdComment = {
      id: temporaryId,
      author: user,
      content: commentContent,
      likes_count: 0,
      user_liked: false,
      parent_comment_id,
      post,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };

    setCommentState((prev) => [createdComment, ...prev]);
    if (parent_comment_id) {
      setReplyContent('');
      setActiveReply(null);
    } else {
      setContent('');
    }

    createComment({ post: post.id, content: commentContent, parent_comment_id }, {
      onSuccess: (data) => {
        setCommentState((prev) => prev.map(comment => 
          comment.id === temporaryId ? { ...comment, id: data.id } : comment
        ));
      },
      onError: () => {
        setCommentState(previousCommentsRef.current);
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
        });
      }
    });
  };

  const handleLike = (comment_id: number) => {
    if (!user) {
        return toast({
        title: 'Login Required',
        variant: 'destructive',
      });
    }

    // Save current liked comments state before updating
    previousCommentsLikeRef.current = likedComments;

    // Optimistic update for likedComments
    const isLiked = likedComments.includes(comment_id);
    setLikedComments((prev) => {
      if (isLiked) {
        return prev.filter(id => id !== comment_id);
      } else {
        return [comment_id, ...prev];
      }
    });

    // Optimistic update for commentState
    setCommentState((prev) => {
      return prev.map(comment => {
        if (comment.id === comment_id) {
          return {
            ...comment,
            likes_count: isLiked ? comment.likes_count - 1 : comment.likes_count + 1,
            user_liked: !isLiked,
          };
        }
        return comment;
      });
    });

    likeComment({ comment_id }, {
      onError: () => {
        // Revert state on error
        setLikedComments(previousCommentsLikeRef.current);
        setCommentState(post.comments);
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
        });
      }
    });
  };

  const renderComments = (comments: IComment[], parentId: number | null = null) => {
    return comments
      ?.filter(comment => comment.parent_comment_id === parentId)
      .map((comment) => (
        <div className={`flex gap-4 justify-between mt-6 ${parentId ? 'ml-8 pl-4 border-l' : ''}`} key={comment.id}>
          <img
            src={comment.author.profile_picture || "/assets/icons/profile-placeholder.svg"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col gap-2 flex-1">
            <span className="font-medium flex items-center gap-5">
              {comment.author.username}
              <p className='max-h-40 truncate text-xs'>
                {multiFormatDateString(comment?.created_at)}
              </p>
            </span>
            <p>{comment.content}</p>
            <div className="flex items-center gap-8 small-medium text-gray-500 mt-2">
              <div className="flex items-center gap-4">
                <img
                  src={
                    likedComments.includes(comment.id) ? 
                    `/assets/icons/comment_liked.svg` : 
                    `/assets/icons/comment_like.svg`
                  }
                  alt="like"
                  width={18}
                  height={18}
                  className="cursor-pointer w-5 h-5"
                  onClick={() => handleLike(comment.id)}
                />
                <span className="text-gray-300 mt-1">|</span>
                <span className="text-gray-500 mt-1">{comment.likes_count} Likes</span>
              </div>
              <div 
                className="cursor-pointer hover:underline small-medium flex gap-2 items-center"
                onClick={() => setActiveReply(comment.id)}
              >
                <img 
                  src="/assets/icons/comments.svg"
                  alt="" 
                  width={23}
                  height={23}
                  />
                Reply
              </div>
            </div>
            {activeReply === comment.id && (
            <form 
              ref={commentRef} 
              onSubmit={(e) => handleComment(e, comment.id)} 
              className="flex items-center gap-4 mt-2">
                <Input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 shad-input"
                  placeholder={`Reply to ${comment.author.username}`}
                  autoFocus
                />
                <Button type="submit" className="shad-button_primary">
                  Send
                </Button>
              </form>
            )}
            {/* Render only the top 2 replies by default */}
            {parentId === null && renderTopReplies(comments, comment.id)}
          </div>
        </div>
      ));
  };

  const renderTopReplies = (comments: IComment[], parentId: number) => {
    const childComments = comments.filter(comment => comment.parent_comment_id === parentId);
    const visible = visibleReplies[parentId];
    const repliesToShow = visible ? childComments : childComments.slice(0, 2);

    return (
      <>
        {repliesToShow.map(comment => renderComments([comment], parentId))}
        {childComments.length > 2 && !visible && (
          <div 
            className="ml-8 pl-4 border-l cursor-pointer text-blue-500 mt-2"
            onClick={() => setVisibleReplies(prev => ({ ...prev, [parentId]: true }))}
          >
            + {childComments.length - 2} more replies
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {user && (
        <div className="flex items-center gap-4">
          <img
            src={user.profile_picture || "/assets/icons/profile-placeholder.svg"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form id="commentForm"
            onSubmit={(e) => {
              toast({title: 'You must be logged in to save a post'});
              handleComment(e)}
            }
            className="flex-1 flex items-center justify-between rounded-xl text-sm px-6 py-2"
          >
            <Input
              value={content}
              type="text" 
              className="shad-input" 
              placeholder="Write a comment..."
              onChange={(e) => setContent(e.target.value)}
            />
          </form>
          <Button type="submit" form="commentForm" className="shad-button_primary">
            Send
          </Button>
        </div>
      )}
      <div className="">
        {renderComments(commentState)}
      </div>
    </>
  );
};

export default Comments;
