import { useEffect } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useSignOutAccount } from "../../lib/react-query/queries";
import { RootState } from "../../redux/rootReducer";
import { resetUserInfo } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";
import { Button } from "../ui/button";


const Topbar = () => {
  const navigate = useNavigate();
  const userLogin = useSelector((state: RootState) => state.user);
  const { 
    userInfo: user,
  } = userLogin;
  const dispatch = useDispatch<AppDispatch>();

  const { mutate: signOut, isSuccess } = useSignOutAccount();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    dispatch(resetUserInfo());
  };

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/static/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={(e) => handleSignOut(e)}>
            <img src="/static/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user?.id}`} className="flex-center gap-3">
            <img
              src={user?.profile_picture || "/static/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
