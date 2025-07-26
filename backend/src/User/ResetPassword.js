import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./resetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.put(
        `http://localhost:4000/api/v1/password/reset/${token}`,
        {
          password,
          confirmPassword,
        },
        config
      );

      alert("Password reset successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={resetPasswordHandler}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
