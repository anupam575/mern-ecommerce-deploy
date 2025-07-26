// src/User/Register.js

import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../redux/slices/authSlice";

import "react-toastify/dist/ReactToastify.css";
import "./register.css";

const Register = () => {
  const [user, setUserState] = useState({ name: "", email: "", password: "" });
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/defaultAvatar.png");
  const [loading, setLoadingLocal] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUserState({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    if (file) reader.readAsDataURL(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingLocal(true);
    dispatch(setLoading());

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/register",
        {
          name: user.name,
          email: user.email,
          password: user.password,
          avatar,
        },
        config
      );

      dispatch(setUser(data.user)); // ✅ Redux + localStorage
      toast.success("🎉 Registered successfully!");

      setTimeout(() => {
        window.location.href = "/"; // ya jaha tu le jana chahta hai
      }, 1500);
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      dispatch(setError(msg));
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={submitHandler}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={user.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={user.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
        />

        <div className="avatar-input">
          <img src={avatarPreview} alt="Avatar Preview" />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default Register;
