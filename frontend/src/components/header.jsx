import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/userApiSlice";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="w-full py-6 flex justify-between items-center px-10 absolute top-0 left-0 bg-black/10 shadow-lg">
      <Link to={"/"} className="text-3xl font-bold">
        VaultGuard
      </Link>
      <div className="flex gap-x-8 justify-center text-xl">
        {userInfo ? (
          <>
            <Link to={"/dashboard"}>Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
