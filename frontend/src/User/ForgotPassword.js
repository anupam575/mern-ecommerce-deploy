import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; 
import { toast } from "react-toastify"; // ✅ Toastify import
import API from "../utils/axiosInstance"; 
import "./forgotPassword.css";

const ForgotPassword = () => {
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const token = loggedInUser?.token; 

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/api/v1/password/forgot", { email });

      // ✅ Success toast
      toast.success(data.message);

      if (data.resetToken) {
        navigate(`/password/reset/${data.resetToken}`);
      } else {
        toast.info("Please check your email for the reset link."); // ✅ Info toast
      }
    } catch (error) {
      // ✅ Error toast
      toast.error(error.response?.data?.message || "Something went wrong");
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
