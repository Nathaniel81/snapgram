import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";


export default function AuthLayout() {
  const userLogin = useSelector((state: RootState) => state.user);
  const { 
      userInfo: isAuthenticated, 
    } = userLogin;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          {/* <img
            src="/static/assets/images/side-img.svg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          /> */}
        </>
      )}
    </>
  );
}
