import axios from 'axios';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import GridPostList from "../../components/shared/GridPostList";
import Loader from "../../components/shared/Loader";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";
import {
  useFollowUserToggle,
  useGetUser,
  useGetUserPosts
} from "../../lib/react-query/queries";
import { RootState } from "../../redux/rootReducer";
import { resetUserInfo, updateUser } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";
import LikedPosts from "./LikedPosts";

interface AxiosError extends Error {
  response?: {
    status: number;
  };
}

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  // const parsedId = parseInt(id ?? '', 10);
  const { toast } = useToast();
  const { data: userPosts, isLoading } = useGetUserPosts(id);
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { data: user, isLoading: isUserLoading } = useGetUser(id ?? '');
  const { mutate: followUser, error: followErr, isSuccess } = useFollowUserToggle();
  const followError = followErr as AxiosError;
  
  const userLogin = useSelector((state: RootState) => state.user);
  const { 
      userInfo: currentUser, 
    } = userLogin;

    useEffect(() => {
      const fetchData = async () => {
        if (followError) {
          if (followError.response?.status === 403) {
            console.log('Error');
            toast({ title: 'You must be logged in to follow a user' });
            dispatch(resetUserInfo());
          } else {
            toast({ title: 'An error occurred while following the user' });
          }
        }
        if (isSuccess) {
          try {
            const response = await axios.get(`/api/user/${currentUser?.id}/`);
            dispatch(updateUser(response.data));
          } catch (error) {
            console.log(error);
          }
        }
      };
    
      fetchData();
    }, [followError, isSuccess, dispatch, currentUser?.id, toast]);
    
  
  if (!currentUser || isLoading || isUserLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              user?.profile_picture || "/static/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {user?.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{user?.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={userPosts?.length} label="Posts" />

              <StatBlock value={user?.followers.length} label="Followers" />
              <StatBlock value={user?.following.length} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {user?.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${id != currentUser?.id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser?.id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  id != currentUser?.id && "hidden"
                }`}>
                <img
                  src={"/static/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${id == currentUser?.id && "hidden"}`}>
              <Button 
                type="button" 
                className="shad-button_primary px-8"
                onClick={() => followUser({id})}
              >
                {currentUser && currentUser?.friends?.some(user => user.id == id) ? "Friends" :
                 (currentUser && currentUser?.following?.some(user => user.id == id) ? "Following" :
                 (currentUser && currentUser?.followers?.some(user => user.id == id) ? "Followback" : "Follow"))}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser?.id == id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/static/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={"/static/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={userPosts} showUser={false} />}
        />
        {currentUser?.id == id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
