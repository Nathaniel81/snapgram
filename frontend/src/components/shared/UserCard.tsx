import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useFollowUserToggle
} from "../../lib/react-query/queries";
import { RootState } from "../../redux/rootReducer";
import { resetUserInfo, updateUser } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";
import { IUser } from "../../types";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

type UserCardProps = {
  user: IUser;
};

interface AxiosError extends Error {
  response?: {
    status: number;
  };
}

const UserCard = ({ user }: UserCardProps) => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const userLogin = useSelector((state: RootState) => state.user);
  const { 
      userInfo: currentUser, 
    } = userLogin;
  const { mutate: followUser, error: followErr, isSuccess } = useFollowUserToggle();
  const followError = followErr as AxiosError;

  const id = user.id;

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

  return (
    <Link 
      to={`/profile/${user?.id}`}
      className="user-card"
    >
      <img
        src={user?.profile_picture || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user?.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user?.username}
        </p>
      </div>

      <Button 
        type="button" 
        className="shad-button_primary px-8"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          followUser({id});
        }}
      >
        {currentUser && currentUser.friends.some(u => u.id === user?.id) ? "Friends" :
         (currentUser && currentUser.following.some(u => u.id === user?.id) ? "Following" :
         (currentUser && currentUser.followers.some(u => u.id === user?.id) ? "Followback" : "Follow"))}
      </Button>
    </Link>

  );
};

export default UserCard;
