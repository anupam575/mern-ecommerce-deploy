// MyProfile.js
import React from "react";
import { useSelector } from "react-redux";
import LogoutButton from './Signup/LogoutButton';

import "./MyProfile.css";

function MyProfile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <p className="error-text">आप लॉगिन नहीं हैं।</p>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.avatar && (
          <img
            src={user.avatar.url}
            alt={user.name || "User Avatar"}
            className="profile-avatar"
          />
        )}
        <LogoutButton /> {/* ✅ Add the button here */}
      </div>
    </div>
  );
}

export default MyProfile;
