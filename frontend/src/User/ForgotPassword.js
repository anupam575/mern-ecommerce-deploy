import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/password/forgot",
        { email },
        config
      );

      alert(data.message);

      // Assume backend response me reset token bhi aa raha hai, for example:
      // data.resetToken

      // Agar backend token nahi bhej raha, toh user ko email se link click karna hoga
      if (data.resetToken) {
        navigate(`/password/reset/${data.resetToken}`);
      } else {
        // Agar token nahi, toh user ko batao ki email check kare
        alert("Please check your email for the reset link.");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={forgotPasswordHandler}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
