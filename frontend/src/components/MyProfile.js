import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import LogoutButton from "./Signup/LogoutButton";
import "./MyProfile.css";

// ✅ Utility: role formatting
const formatRole = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1) : "Not assigned";

// ✅ Utility: generate initials avatar if no avatar
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  return parts.map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");
};

function MyProfile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Esc key to close modal
  const handleEsc = useCallback((e) => {
    if (e.key === "Escape") setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen, handleEsc]);

  // ✅ If not logged in
  if (!isAuthenticated) {
    return <p className="profile__error">⚠️ You are not logged in</p>;
  }

  return (
    <div className="profile">
      <h2 className="profile__title">My Profile</h2>
      <div className="profile__details">
        <p>
          <strong>Name:</strong> {user?.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {formatRole(user?.role)}
        </p>

        {/* Avatar */}
        {user?.avatar ? (
          <>
            <img
              src={user.avatar}
              alt={user?.name || "User Avatar"}
              className="profile__avatar"
              onClick={() => setIsModalOpen(true)}
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/150?text=${getInitials(
                  user?.name
                )}`;
              }}
            />

            {isModalOpen && (
              <div
                className="modal"
                onClick={() => setIsModalOpen(false)}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className="modal__content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={user.avatar}
                    alt="Full Avatar"
                    className="modal__image"
                  />
                  <button
                    className="modal__close"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close Modal"
                  >
                    ✖
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="profile__avatar-placeholder">
            {getInitials(user?.name)}
          </div>
        )}

        <LogoutButton />
      </div>
    </div>
  );
}

export default MyProfile;
