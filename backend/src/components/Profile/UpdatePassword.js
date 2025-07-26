// components/UpdatePassword.js
import React, { useState } from "react";
import axios from "axios";
import "./password.css";

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "http://localhost:4000/api/v1/password/update",
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      alert("Password updated");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <form className="password-form" onSubmit={updatePassword}>
      <h2>Update Password</h2>
      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">Update</button>
    </form>
  );
}

export default UpdatePassword;
