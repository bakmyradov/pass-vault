import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/userApiSlice";
import { apiSlice } from "../slices/apiSlice";
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
      dispatch(apiSlice.util.resetApiState());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 drop-shadow-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-20 items-center justify-between px-8">
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
      </div>
    </header>
  );
};

export default Header;
