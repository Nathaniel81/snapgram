import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { IUser } from "../../types";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";


export type SearchResultProps = {
  isSearchFetching: boolean;
  // eslint-disable-next-line 
  searchedPosts: any;
};


const Friends = () => {
  const userLogin = useSelector((state: RootState) => state.user);
  const { userInfo: currentUser } = userLogin;
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const friendsToDisplay = searchValue
    ? currentUser?.friends?.filter((user: IUser) =>
        user?.name?.toLowerCase().includes(searchValue.toLowerCase())
      ) || []
    : currentUser?.friends || [];

  return (
    <div className="common-container">
      <div className="max-w-5xl flex flex-col items-start w-full gap-2 md:gap-4">
        <h2 className="h3-bold md:h2-bold text-left w-full">Friends</h2>
        <div className="explore-inner_container my-10">
          <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
            <img
              src="/assets/icons/search.svg"
              width={24}
              height={24}
              alt="search"
            />
            <Input
              type="text"
              placeholder="Search"
              className="explore-search"
              value={searchValue}
              onChange={(e) => {
                const { value } = e.target;
                setSearchValue(value);
              }}
            />
          </div>
        </div>
        {friendsToDisplay.length > 0 ? (
          friendsToDisplay.map((user: IUser, index: number) => (
            <div
              key={index}
              onClick={() => navigate(`/chat/${user?.id}`)}
              className="w-full cursor-pointer flex rounded-md justify-between items-center p-4 bg-dark-2 hover:bg-dark-3 transition-colors duration-200"
            >
              <div className="flex justify-between">
                <img
                  src={
                    user?.profile_picture ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="user"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-sm text-gray-600">@{user?.username}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>{searchValue ? "No friends match your search." : "No friends to display."}</p>
        )}
      </div>
    </div>
  );
};

export default Friends;
