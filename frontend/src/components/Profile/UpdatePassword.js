import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./password.css";

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/password/update`,
        { oldPassword, newPassword, confirmPassword },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // ✅ cookies handle karega auth
        }
      );

      toast.success("✅ Password updated successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error updating password");
    } finally {
      setLoading(false);
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
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
}

export default UpdatePassword;
