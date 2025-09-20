import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance";
import { clearUser, setLoading } from "../../redux/slices/authSlice";
import "../../components/MyProfile.css";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));

      // ✅ Call backend to clear cookies/session
      await API.post("/api/v1/logout");

      // ✅ Clear redux + localStorage
      dispatch(clearUser());
      localStorage.removeItem("user");

      // ✅ Success feedback
      toast.success("✅ Logged out successfully");

      // ✅ Navigate without full reload
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("❌ Logout error:", error.response?.data || error.message);
      toast.error("Logout failed, please try again.");
      dispatch(setLoading(false));
    }
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      🚪 Logout
    </button>
  );
};

export default LogoutButton;
