import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [userInfo, navigate]);

  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
