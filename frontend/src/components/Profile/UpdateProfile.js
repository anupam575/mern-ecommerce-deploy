import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance";
import "./users.css";

const initialFormData = {
  name: "",
  email: "",
  avatar: null,
};

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form with logged-in user
  useEffect(() => {
    if (loggedInUser) {
      setFormData({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        avatar: null,
      });
      setPreview(loggedInUser.avatar || "");
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    setPreview(URL.createObjectURL(file));
  };

  // Upload avatar to Cloudinary via backend signature
  const uploadToCloudinary = useCallback(async (file) => {
    try {
      const { signature, timestamp, folder, cloudName, apiKey } =
        await API.get("/api/v1/get-signature").then((res) => res.data);

      const data = new FormData();
      data.append("file", file);
      data.append("api_key", apiKey);
      data.append("folder", folder);
      data.append("timestamp", timestamp);
      data.append("signature", signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (!result.secure_url) throw new Error(result.error?.message || "Upload failed");

      return { url: result.secure_url, public_id: result.public_id };
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarData = null;
      if (formData.avatar) {
        avatarData = await uploadToCloudinary(formData.avatar);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        avatar: avatarData,
      };

      const { data } = await API.put("/api/v1/me/update", payload);

      // Update Redux state with formatted user
      dispatch(setUser(data.user));
      toast.success("✅ Profile updated successfully!");
      setFormData({ ...formData, avatar: null });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />
        {preview && (
          <div>
            <img
              src={preview}
              alt="Avatar Preview"
              style={{ width: "100px", borderRadius: "50%" }}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
