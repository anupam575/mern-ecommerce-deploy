import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import ConfirmModal from "./ConfirmModal";
import "./category.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const navigate = useNavigate();

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/v1/categories");
      setCategories(res.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Show modal
  const confirmDelete = (id) => {
    setSelectedCatId(id);
    setModalVisible(true);
  };

  // Delete category
  const handleDelete = async () => {
    if (!selectedCatId) return;
    setLoading(true);
    try {
      await API.delete(`/api/v1/admin/category/${selectedCatId}`);
      setCategories(categories.filter((cat) => cat._id !== selectedCatId));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setModalVisible(false);
      setSelectedCatId(null);
    }
  };

  return (
    <div className="category-container">
      <h2 className="category-title">Category Management</h2>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <table className="category-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/update/category/${cat._id}`)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => confirmDelete(cat._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <ConfirmModal
        show={modalVisible}
        message="Are you sure you want to delete"
        onConfirm={handleDelete}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

export default CategoryList;
