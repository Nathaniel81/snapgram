import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { INavLink } from "../../types";
import { sidebarLinks } from "../../constants";
import Loader from "./Loader";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { useSignOutAccount } from "../../lib/react-query/queries";
import { useEffect } from "react";
import { resetUserInfo } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";

const LeftSidebar = () => {
  const userLogin = useSelector((state: RootState) => state.user);
  const { userInfo: user, loading: isLoading } = userLogin;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();

  const { mutate: signOut, isSuccess } = useSignOutAccount();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/');
    dispatch(resetUserInfo());
    signOut();
  };

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        {isLoading ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : !user?.email ? (
          <div className="flex gap-3 items-center">
            <img
              src="/assets/icons/profile-placeholder.svg"
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <Button
              variant="ghost" 
              onClick={() => navigate("/sign-in")}
              className="shad-button_ghost">
              <img src="/assets/icons/signin.svg" alt="signin" />
              <p className="small-medium lg:base-medium">Sign In</p>
            </Button>
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.profile_picture || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}>
                <NavLink to={link.route} className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive && "invert-white"}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {user?.email && (
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={(e) => handleSignOut(e)}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">Logout</p>
        </Button>
      )}
    </nav>
  );
};

export default LeftSidebar;
