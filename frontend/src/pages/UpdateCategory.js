import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ import toast
import API from "../utils/axiosInstance";
import "./category.css"; // all styles moved here

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch category data by ID
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get(`/api/v1/category/${id}`);
        setCategoryName(res.data.category.name);
      } catch (err) {
        toast.error(err.response?.data?.message || "❌ Failed to load category");
      }
    };
    fetchCategory();
  }, [id]);

  // Update category
  const handleUpdate = async () => {
    if (!categoryName.trim()) {
      toast.warn("⚠️ Category name cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      await API.put(`/api/v1/admin/category/${id}`, { name: categoryName });
      toast.success("✅ Category updated successfully!");
      navigate("/admin/category");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-container">
      <h2 className="category-header">Update Category</h2>

      <div className="form-group">
        <label className="form-label">Category Name</label>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          className="form-input"
        />
      </div>

      <button
        onClick={handleUpdate}
        className={`submit-btn ${loading ? "disabled-btn" : ""}`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Category"}
      </button>
    </div>
  );
};

export default UpdateCategory;
