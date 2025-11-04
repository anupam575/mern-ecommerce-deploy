import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance";
import { setFetchedUser, setError, setLoading } from "../../redux/slices/authSlice";
import "./user.css";

const GetUser = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  // ✅ API call function
  const fetchUser = useCallback(async () => {
    dispatch(setError(null));
    dispatch(setLoading(true));
    try {
      const { data } = await API.get("/api/v1/me");
      if (data?.user) {
        dispatch(setFetchedUser(data.user));
        toast.success("✅ User data fetched successfully");
      } else {
        dispatch(setError("User data not found"));
        toast.error("❌ User data not found");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch user";
      dispatch(setError(message));
      toast.error(`❌ ${message}`);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ✅ Fetch on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ✅ Date formatting helper
  const formatDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(dateString));
    } catch {
      return "Date not available";
    }
  };

  return (
    <div className="user-container">
      <h2>User Details</h2>

      {/* Loading State */}
      {loading && <p className="loading-text">⏳ Loading user...</p>}

      {/* Error State */}
      {!loading && error && <p className="error-text">{error}</p>}

      {/* User Data */}
      {!loading && user && (
        <div className="user-card">
          <p>
            <strong>Name:</strong> {user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={`Avatar of ${user?.name}`}
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/100?text=No+Image";
              }}
            />
          ) : (
            <p>📸 No profile photo available</p>
          )}

          <p>
            <strong>Role:</strong> {user?.role || "Role not available"}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {user?.createdAt ? formatDate(user.createdAt) : "Date not available"}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !user && !error && <p>No user found</p>}
    </div>
  );
};

export default GetUser;
