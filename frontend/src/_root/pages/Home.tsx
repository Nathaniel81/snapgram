import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const userLogin = useSelector((state: RootState) => state.user);
    const { 
        userInfo, 
      } = userLogin;
      const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate('/sign-in');
        }
    }, [userInfo, navigate]);

  return (
    <div>Home</div>
  );
};

export default Home;
