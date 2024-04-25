import { useToast } from "../../hooks/useToast";
import Loader from "../../components/shared/Loader";
import { useGetUsers } from "../../lib/react-query/queries";
import { IUser } from "../../types";
import { Input } from "../../components/ui/input";
import { useState } from "react";
// import useDebounce from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

export type SearchResultProps = {
  isSearchFetching: boolean;
  // eslint-disable-next-line 
  searchedPosts: any;
};

// const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
//   if (isSearchFetching) {
//     return <Loader />;
//   } else if (searchedPosts && searchedPosts.length > 0) {
//     return <GridPostList posts={searchedPosts} />;
//   } else {
//     return (
//       <p className="text-light-4 mt-10 text-center w-full">No results found</p>
//     );
//   }
// };


const AllUsers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: users, isLoading, isError: isErrorCreators } = useGetUsers(); //freinds

  const [searchValue, setSearchValue] = useState("");
  // const debouncedSearch = useDebounce(searchValue, 500);
  // const { data: searchedFreinds, isFetching: isSearchFetching } = useSearchFreinds(debouncedSearch);

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="common-container">
      <div className="max-w-5xl flex flex-col items-start w-full gap-2 md:gap-4">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
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
        {isLoading && !users ? (
          <Loader />
        ) : (
        <>
          {users?.map((user: IUser, index: number) => (
            <div 
              key={index} 
              onClick={() => navigate(`/chat/${user?.id}`)}
              className="w-full cursor-pointer flex rounded-md justify-between items-center p-4 bg-dark-2 hover:bg-dark-3 transition-colors duration-200">
              <div className='flex justify-between'>
                <img
                  src={
                    user.profile_picture ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="user"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
              </div>
            </div>
          ))}
        </>
        )}
      </div>
    </div>
  );
}  

export default AllUsers;