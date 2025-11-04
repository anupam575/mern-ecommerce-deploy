// src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../utils/axiosInstance";
import "./register.css";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  avatar: null,
};

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputFields = [
    { name: "name", type: "text", label: "Name", placeholder: "Enter your name" },
    { name: "email", type: "email", label: "Email", placeholder: "Enter your email" },
    { name: "password", type: "password", label: "Password", placeholder: "Enter password" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.warn("Only JPG/PNG images allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.warn("Photo must be < 10MB");
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const isPasswordStrong = (pwd) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  // ✅ Cloudinary Upload with signature (returns url + public_id)
  const uploadToCloudinary = async (file) => {
    try {
      const { signature, timestamp, folder, cloudName, apiKey } = await API.get(
        "/api/v1/get-signature"
      ).then((res) => res.data);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("folder", folder);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!data.secure_url || !data.public_id)
        throw new Error(data.error?.message || "Upload failed");

      // ✅ Return both url + public_id
      return { url: data.secure_url, public_id: data.public_id };
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, avatar } = formData;

    if (!name || !email || !password) {
      toast.warn("All fields required");
      setLoading(false);
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.warn(
        "Password must be 8+ chars, uppercase, lowercase, number & special char"
      );
      setLoading(false);
      return;
    }

    try {
      let avatarData = null;
      if (avatar) {
        avatarData = await uploadToCloudinary(avatar); // ✅ returns { url, public_id }
      }

      // ✅ Send user data + avatar to backend
      const { data } = await API.post("/api/v1/register", {
        name,
        email,
        password,
        avatar: avatarData, // ✅ save object { url, public_id }
      });

      if (setUser) setUser(data.user);

      toast.success(data.message || "Registration successful");
      setFormData(initialFormData);
      setPreview(null);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>

        {inputFields.map((field) => (
          <div key={field.name} className="input-group">
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === "password" ? (
              <div className="password-wrapper">
                <input
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="password-toggle"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}

        <label htmlFor="avatar">Avatar (optional)</label>
        <input
          id="avatar"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
        />
        {preview && (
          <img src={preview} alt="Avatar preview" className="avatar-preview" />
        )}

        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
