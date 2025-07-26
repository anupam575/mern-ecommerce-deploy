// components/UpdateProfile.js
import React, { useState } from "react";
import axios from "axios";
import "./profile.css";

function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:4000/api/v1/me/update",
        { name, email, avatar },
        { withCredentials: true }
      );
      alert("Profile updated");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form className="profile-form" onSubmit={updateProfile}>
      <h2>Update Profile</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Avatar Preview" />}
      <button type="submit">Update</button>
    </form>
  );
}

export default UpdateProfile;
