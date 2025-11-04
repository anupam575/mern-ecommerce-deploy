import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/axiosInstance";
import {
  setFetchedUser,
  clearUser,
  setLoading,
} from "../redux/slices/authSlice";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await api.get("/api/v1/me");
        dispatch(setFetchedUser(data.user));
      } catch (err) {
        console.error("❌ Fetch user failed:", err.response?.data || err.message);
        dispatch(clearUser());
      } finally {
        dispatch(setLoading(false));
        setCheckingAuth(false);
      }
    };

    // ✅ Only fetch if user not logged in AND not manually logged out
    if (!user && !localStorage.getItem("loggedOut")) {
      fetchUser();
    } else {
      setCheckingAuth(false);
    }
  }, [dispatch, user]);

  if (authLoading || checkingAuth) {
    return <div className="spinner">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
