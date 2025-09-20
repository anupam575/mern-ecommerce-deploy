import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance";
import ConfirmModal from "../../pages/ConfirmModal"; // reusable modal
import "./ProductPanel.css";

const AdminProductsPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [error, setError] = useState("");

  // Fetch Products
  const fetchAdminProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/v1/admin/products");
      setProducts(data.products || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load products");
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  // Delete Product (Optimistic UI)
  const confirmDelete = async () => {
    if (!deleteProductId) return;
    const originalProducts = [...products];
    setProducts((prev) => prev.filter((p) => p._id !== deleteProductId));
    setDeleteProductId(null);
    toast.info("🗑️ Deleting product...");

    try {
      await API.delete(`/api/v1/admin/product/${deleteProductId}`);
      toast.success("✅ Product deleted successfully");
      fetchAdminProducts();
    } catch (err) {
      console.error(err);
      setProducts(originalProducts); // rollback
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="admin-products-container">
      <div className="top-bar">
        <Link to="/dashboard" className="back-btn">
          ⬅️ Back to Dashboard
        </Link>
        <h2>🛒 Admin Products Panel</h2>
      </div>

      {loading ? (
        <p className="loading-text">⏳ Loading products...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : products.length === 0 ? (
        <p className="no-data-text">No products found.</p>
      ) : (
        <div className="products-list">
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price (₹)</th>
                  <th>Stock</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id}>
                    <td>{prod._id}</td>
                    <td>{prod.name}</td>
                    <td>₹{prod.price}</td>
                    <td>{prod.stock}</td>
                    <td>
                      <Link
                        to={`/admin/product/${prod._id}/update`}
                        className="edit-btn"
                        aria-label={`Edit ${prod.name}`}
                      >
                        ✏️ Edit
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={() => setDeleteProductId(prod._id)}
                        className="delete-btn"
                        aria-label={`Delete ${prod.name}`}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {products.map((prod) => (
              <div className="product-card" key={prod._id}>
                <h3>{prod.name}</h3>
                <p>
                  <strong>ID:</strong> {prod._id}
                </p>
                <p>
                  <strong>Price:</strong> ₹{prod.price}
                </p>
                <p>
                  <strong>Stock:</strong> {prod.stock}
                </p>
                <div className="action-buttons">
                  <Link
                    to={`/admin/product/${prod._id}/update`}
                    className="edit-btn"
                    aria-label={`Edit ${prod.name}`}
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => setDeleteProductId(prod._id)}
                    className="delete-btn"
                    aria-label={`Delete ${prod.name}`}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={!!deleteProductId}
        message="Are you sure you want to delete this product?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteProductId(null)}
      />
    </div>
  );
};

export default AdminProductsPanel;
