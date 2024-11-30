import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { logout } from "../slices/authSlice";
import { useDispatch } from "react-redux";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      toast.error("Session expired. Please log in again.");
      dispatch(logout());
      navigate("/login");
    }
  }, [userInfo, navigate]);

  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
