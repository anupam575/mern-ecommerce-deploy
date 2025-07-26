import React, { useState } from "react";
import axios from "axios";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
