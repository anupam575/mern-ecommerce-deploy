// src/User/Login.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // to send cookie
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/login",
        { email, password },
        config
      );

      dispatch(setUser(data.user)); // ✅ Set user in Redux
      toast.success("✅ Logged in successfully!");

      setTimeout(() => {
        navigate("/"); // ✅ Redirect after login
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={loginHandler}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
          onClick={() => navigate("/password/forgot")}
        >
          Forgot Password?
        </p>
      </form>

      {/* Toast message container */}
      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default Login;
