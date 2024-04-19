import { useSelector } from "react-redux";
import GridPostList from "../../components/shared/GridPostList";
import Loader from "../../components/shared/Loader";
import { useLikedPosts } from "../../lib/react-query/queries";
import { RootState } from "../../redux/rootReducer";


const LikedPosts = () => {
  const {data: likedPosts, isLoading} = useLikedPosts();
  const userLogin = useSelector((state: RootState) => state.user);
  const { 
      userInfo: currentUser, 
    } = userLogin;

  if (!currentUser || isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {likedPosts?.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={likedPosts} showStats={false} />
    </>
  );
};

export default LikedPosts;