import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import Toast
import API from "../utils/axiosInstance";
import "./category.css";

const CreateCategory = ({ onCategoryCreated }) => {
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      toast.warn("⚠️ Please enter a category name!");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/api/v1/admin/category/new", {
        name: newCategory,
      });

      if (onCategoryCreated) onCategoryCreated(res.data.category);

      toast.success("✅ Category created successfully!");
      setNewCategory("");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    

      {/* 🔹 Form */}
      <div className="category-container">
        <h2 className="category-header">Create Category</h2>

        <div className="form-group">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="form-input"
          />
        </div>

        <button
          onClick={handleAdd}
          className={`submit-btn ${loading ? "disabled-btn" : ""}`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </div>
    </>
  );
};

export default CreateCategory;
